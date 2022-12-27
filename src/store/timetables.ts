import { type StateCreator } from "zustand";
import { type SettingsSlice } from "./settings";

interface Lesson {
  name: string;
  location: string;
  description: string;
  begin: string;
  end: string;
}

// from monday (0) to sunday (6)
type Lessons = [
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
  Lesson[],
];

export interface Timetable {
  [key: string]: string | boolean | Lessons | null;
  url: string;
  name: string;
  color: string;
  visible: boolean;
  lessons: Lessons;
  folder: string | null;
}

export interface TimetablesSlice {
  timetables: Timetable[];
  personalTimetable: Timetable | null;
}

export const createTimetableSlice: StateCreator<
  SettingsSlice & TimetablesSlice,
  [
    ["zustand/persist", unknown],
    ["zustand/immer", never],
    ["zustand/devtools", never],
  ],
  [],
  TimetablesSlice
> = (set) => ({
  personalTimetable: null,
  timetables: [],
});
