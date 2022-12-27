import { type StateCreator } from "zustand";
import { type TimetablesSlice } from "./timetables";

export interface SettingsSlice {
  showWeekend: boolean;
  showExplorer: boolean;
  showTimematch: boolean;
  toggleShowWeekend: () => void;
  toggleShowExplorer: () => void;
  toggleShowTimematch: () => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice & TimetablesSlice,
  [
    ["zustand/persist", unknown],
    ["zustand/immer", never],
    ["zustand/devtools", never],
  ],
  [],
  SettingsSlice
> = (set) => ({
  showWeekend: false,
  showExplorer: true,
  showTimematch: false,
  toggleShowWeekend: () =>
    set((state) => {
      state.showWeekend = !state.showWeekend;
    }),
  toggleShowExplorer: () =>
    set((state) => {
      state.showExplorer = !state.showExplorer;
    }),
  toggleShowTimematch: () =>
    set((state) => {
      state.showTimematch = !state.showTimematch;
    }),
});
