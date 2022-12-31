import ICAL from "ical.js";
import { z } from "zod";
import { type Lessons } from "../../../types/timetable";
import { router, publicProcedure } from "../trpc";

export const icalRouter = router({
  getUSTLessons: publicProcedure
    .input(
      z.object({
        plannerURL: z
          .string()
          .url()
          .regex(/^https:\/\/admlu65\.ust\.hk\/planner\/export\/.+\.ics$/),
      }),
    )
    .query(async ({ input: { plannerURL } }) => {
      const icalBlob = await fetch(plannerURL);
      const ical = await icalBlob.text();

      // TODO: Add error descriptions (parsing error, fetching error)
      const jcal = ICAL.parse(ical);
      const comp = new ICAL.Component(jcal);
      const vevents = comp.getAllSubcomponents("vevent");

      const lessons: Lessons = [[], [], [], [], [], [], []];

      for (let i = 0; i < vevents.length; i++) {
        const event = new ICAL.Event(vevents[i]);

        // https://kewisch.github.io/ical.js/api/ICAL.Time.html#adjust
        // Timetable Planner minute percision is xx:00 or xx:30, but lessons actually ends on xx:50 and xx:20
        event.endDate.adjust(0, 0, -10, 0);

        // https://kewisch.github.io/ical.js/api/ICAL.Time.html#.weekDay
        // dayOfWeek(2): Change start to Monday (1-indexed)
        // - 1: Change to 0-indexed
        lessons[event.startDate.dayOfWeek(2) - 1]?.push({
          name: event.summary,
          venue: event.location,
          description: event.description,
          // Ensuring date is in HH:MM format
          begin:
            event.startDate.hour.toString().padStart(2, "0") +
            ":" +
            event.startDate.minute.toString().padStart(2, "0"),
          end:
            event.endDate.hour.toString().padStart(2, "0") +
            ":" +
            event.endDate.minute.toString().padStart(2, "0"),
        });
      }

      return { lessons };
    }),
});
