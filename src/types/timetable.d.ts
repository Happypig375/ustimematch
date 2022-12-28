interface Lesson {
  // Course title and section (e.g. COMP 1021 L01)
  name: string;
  venue: string;
  // Additional information (e.g. instructors)
  description: string;
  // Time in 24-hour format
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

interface Modifications {
  additional: Lessons;
  remarks: string;
}

interface BaseTimetable {
  name: string;
  color: string;
  lessons: Lessons;
  modifications: Modifications;
  university:
    | "HKUST"
    | "HKU"
    | "CUHK"
    | "POLYU"
    | "CITYU"
    | "HKBU"
    | "EDUHK"
    | "HKMU";
}

interface HKUSTTimetable extends BaseTimetable {
  plannerURL: string;
  university: "HKUST";
}

// Can be constructed as union for additional universities
export type Timetable = HKUSTTimetable;
