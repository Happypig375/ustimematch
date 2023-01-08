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

// Change how lesson names are interpreted
// (e.g. HKUST: COMP 1021 (L01) -> {COMP 1021}{L01})
export type University =
  | "HKUST"
  | "HKU"
  | "CUHK"
  | "POLYU"
  | "CITYU"
  | "HKBU"
  | "EDUHK"
  | "HKMU";

// interface Remark {
//   // Indexs of lessons
//   index: number;
//   value: string;
// }

// interface Modifications {
//   add: Lessons;
//   // Indexs of lessons to hide (ignoring add)
//   hide: number[];
//   remarks: Remark[];
// }

// Local config of timetable (shouldn't be send to server)
interface TimetableConfig {
  // id is only for client side reference
  id: string;
  color: string;
  visible: boolean;
}

interface BaseTimetable {
  name: string;
  lessons: Lessons;
  university: University;
  config: TimetableConfig;
  // modifications?: Modifications;
}

interface HKUSTTimetable extends BaseTimetable {
  university: "HKUST";
  plannerURL: string;

  // Should fetch update from planner or ustimematch
  // Placeholder for implementing modifications
  // soure: "PLANNER" | "USTIMEMATCH";
}

// Can be constructed as union for additional universities
export type Timetable = HKUSTTimetable;

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
