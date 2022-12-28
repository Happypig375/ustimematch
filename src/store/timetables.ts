import { type StateCreator } from "zustand";
import { type Timetable } from "../types/timetable";
import { type StatesSlice } from "./states";

export interface TimetablesSlice {
  timetables: Timetable[];
  personalTimetable: Timetable | null;
  setPersonalTimetable: (timetable: Timetable) => void;
}

export const createTimetableSlice: StateCreator<
  StatesSlice & TimetablesSlice,
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
  setPersonalTimetable: (timetable) =>
    set((state) => {
      state.personalTimetable = timetable;
    }),
});
