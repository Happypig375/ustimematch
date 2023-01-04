interface Lesson {
  // Course title and section (e.g. COMP 1021 L01)
  name: string;
  venue: string;
  // Additional information (e.g. course title, instructors)
  description: string;
  // Time in 24-hour format (HH:mm)
  begin: string;
  end: string;
}

// From monday to sunday (0 to 6)
// Easier to consume, as lessons are repeated every week (compared to storing ISO8601 with date and time)
type Lessons = [
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
];

export type University =
  | "HKUST"
  | "HKU"
  | "CUHK"
  | "POLYU"
  | "CITYU"
  | "HKBU"
  | "EDUHK"
  | "HKMU";

interface Remark {
  // Indexs of lessons
  index: number;
  value: string;
}

interface Modifications {
  add: Lessons;
  // Indexs of lessons to hide (ignoring add)
  hide: number[];
  remarks: Remark[];
}

interface BaseTimetable {
  name: string;
  lessons: Lessons;
  modifications?: Modifications;
  university: University;
}

interface HKUSTTimetable extends BaseTimetable {
  plannerURL: string;
  university: "HKUST";
}

// Can be constructed as union for additional universities
export type Timetable = HKUSTTimetable;

interface TimetableConfig {
  // id is only for client side reference
  id: string;
  // color can be modified after being imported
  color: string;
  // visible can also be modified
  visible: boolean;
}

export interface FlattenTimetable extends Timetable {
  config: TimetableConfig;
}
