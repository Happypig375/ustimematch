import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import ICAL from "ical.js";
import { type Lessons } from "../../../types/timetable";

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

      const jcal = ICAL.parse(ical);
      const comp = new ICAL.Component(jcal);
      const vevents = comp.getAllSubcomponents("vevent");

      const lessons: Lessons = [[], [], [], [], [], [], []];

      for (let i = 0; i < vevents.length; i++) {
        const event = new ICAL.Event(vevents[i]);

        // https://kewisch.github.io/ical.js/api/ICAL.Time.html#.weekDay
        // dayOfWeek(2): Change start to Monday (1-indexed)
        // - 1: Change to 0-indexed
        lessons[event.startDate.dayOfWeek(2) - 1]?.push({
          name: event.summary,
          venue: event.location,
          description: event.description,
          begin: event.startDate.hour + ":" + event.startDate.minute,
          // Timetable Planner minute percision is xx:00 or xx:30, but lessons actually ends on xx:50 and xx:20
          end: event.endDate.hour + ":" + (event.endDate.minute - 10),
        });
      }

      return { lessons };
    }),
});
