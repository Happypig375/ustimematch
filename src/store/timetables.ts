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
  // setTimetables: (timetables: Timetable[]) => void;
  timetablesConfigs: TimetableConfig[];
  // setTimetablesConfigs: (configs: TimetableConfig[]) => void;
  addTimetable: (
    timetable: Timetable,
    timetableConfig: TimetableConfig,
  ) => void;
  deleteTimetable: (timetableId: string) => void;
  editTimetable: (
    timetable: Timetable,
    timetableConfig: TimetableConfig,
  ) => void;
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
  // setTimetables: (timetables) =>
  //   set((state) => {
  //     state.timetables = timetables;
  //   }),
  timetablesConfigs: [],
  // setTimetablesConfigs: (configs) =>
  //   set((state) => {
  //     state.timetablesConfigs = configs;
  //   }),
  addTimetable: (timetable, timetableConfig) =>
    set((state) => {
      state.timetables.push(timetable);
      state.timetablesConfigs.push(timetableConfig);
    }),
  deleteTimetable: (timetableId) =>
    set((state) => {
      const idx = state.timetablesConfigs.findIndex(
        (config) => config.id === timetableId,
      );
      if (idx === -1) return;
      state.timetables.splice(idx, 1);
      state.timetablesConfigs.splice(idx, 1);
    }),
  editTimetable: (timetable, timetableConfig) =>
    set((state) => {
      const idx = state.timetablesConfigs.findIndex(
        (config) => config.id === timetableConfig.id,
      );
      if (idx === -1) return;

      state.timetables[idx] = timetable;
      state.timetablesConfigs[idx] = timetableConfig;
    }),
});
