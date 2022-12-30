import { type StateCreator } from "zustand";
import { type TimetableConfig, type Timetable } from "../types/timetable";
import { type StatesSlice } from "./states";

export interface TimetablesSlice {
  timetables: Timetable[];
  personalTimetable: Timetable | null;
  setPersonalTimetable: (timetable: Timetable | null) => void;
  personalTimetableConfig: TimetableConfig;
  togglePersonalTimetableVisible: () => void;
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
  timetables: [],
  personalTimetable: null,
  setPersonalTimetable: (timetable) =>
    set((state) => {
      state.personalTimetable = timetable;
    }),
  personalTimetableConfig: {
    visible: true,
  },
  togglePersonalTimetableVisible: () =>
    set((state) => {
      state.personalTimetableConfig.visible =
        !state.personalTimetableConfig.visible;
    }),
});
