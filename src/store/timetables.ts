import { type StateCreator } from "zustand";
import { type TimetableConfig, type Timetable } from "../types/timetable";
import { type StatesSlice } from "./states";

export interface TimetablesSlice {
  personalTimetable: Timetable | null;
  setPersonalTimetable: (timetable: Timetable | null) => void;
  personalTimetableConfig: TimetableConfig | null;
  setPersonalTimetableConfig: (config: TimetableConfig | null) => void;
  // One-to-one mapping of timetables and configs
  timetables: Timetable[];
  setTimetables: (timetables: Timetable[]) => void;
  timetablesConfigs: TimetableConfig[];
  setTimetablesConfigs: (configs: TimetableConfig[]) => void;
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
  setPersonalTimetable: (timetable) =>
    set((state) => {
      state.personalTimetable = timetable;
    }),
  personalTimetableConfig: null,
  setPersonalTimetableConfig: (config) =>
    set((state) => {
      state.personalTimetableConfig = config;
    }),
  timetables: [],
  setTimetables: (timetables: Timetable[]) =>
    set((state) => {
      state.timetables = timetables;
    }),
  timetablesConfigs: [],
  setTimetablesConfigs: (configs: TimetableConfig[]) =>
    set((state) => {
      state.timetablesConfigs = configs;
    }),
});
