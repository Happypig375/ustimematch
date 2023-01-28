import { z } from "zod";

const ZTime24 = z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

const ZLesson = z.object({
  // Course title and section (e.g. COMP 1021 L01)
  name: z.string().max(40),
  venue: z.string().max(40),
  // Additional information (e.g. course title, instructors)
  description: z.string().max(160),
  // Time in 24-hour format (HH:mm)
  // https://digitalfortress.tech/tips/top-15-commonly-used-regex/
  begin: ZTime24,
  end: ZTime24,
});

// From monday to sunday (0 to 6)
// [[], [], [], [], [], [], []]
// Easier to consume, as lessons are repeated every week (compared to storing ISO8601 with date and time)
const ZLessons = ZLesson.array().array().length(7);

// Change how lesson names are interpreted
// (e.g. HKUST: COMP 1021 (L01) -> {COMP 1021}{L01})
const ZUniversity = z.enum([
  "HKUST",
  "HKU",
  "CUHK",
  "POLYU",
  "CITYU",
  "HKBU",
  "EDUHK",
  "HKMU",
]);

// Local config of timetable (server should omit id and visible)
const ZTimetableConfig = z.object({
  id: z.string(),
  // Hex color
  // https://mkyong.com/regular-expressions/how-to-validate-hex-color-code-with-regular-expression/
  color: z.string().regex(/^#([a-fA-F0-9]{6})$/, { message: "Invalid color" }),
  visible: z.boolean(),
});

export const ZBaseTimetable = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter a name" })
    .max(40, { message: "The name is too long" }),
  lessons: ZLessons,
  university: ZUniversity,
  config: ZTimetableConfig,
});

export const ZHKUSTTimetable = ZBaseTimetable.extend({
  university: z.literal("HKUST"),
  plannerURL: z
    .string()
    .regex(/^https:\/\/admlu65\.ust\.hk\/planner\/export\/.+\.ics$/, {
      message: "Invalid planner URL",
    }),
});

export const ZTimetable = z.discriminatedUnion("university", [ZHKUSTTimetable]);

export type Lesson = z.infer<typeof ZLesson>;
export type Lessons = z.infer<typeof ZLessons>;
export type University = z.infer<typeof ZUniversity>;
export type TimetableConfig = z.infer<typeof ZTimetableConfig>;
export type BaseTimetable = z.infer<typeof ZBaseTimetable>;
export type Timetable = z.infer<typeof ZTimetable>;

// Types for timematch periods
export interface Period {
  begin: string;
  end: string;
}

export type Periods = [
  Period[],
  Period[],
  Period[],
  Period[],
  Period[],
  Period[],
  Period[],
];
