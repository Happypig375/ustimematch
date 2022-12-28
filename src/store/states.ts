import { type StateCreator } from "zustand";
import { type TimetablesSlice } from "./timetables";

export interface StatesSlice {
  showWeekend: boolean;
  showExplorer: boolean;
  showTimematch: boolean;
  explorerReorderMode: boolean;
  toggleShowWeekend: () => void;
  toggleShowExplorer: () => void;
  toggleShowTimematch: () => void;
  toggleExplorerReorderMode: () => void;
}

export const createStatesSlice: StateCreator<
  StatesSlice & TimetablesSlice,
  [
    ["zustand/persist", unknown],
    ["zustand/immer", never],
    ["zustand/devtools", never],
  ],
  [],
  StatesSlice
> = (set) => ({
  showWeekend: false,
  showExplorer: true,
  showTimematch: false,
  explorerReorderMode: false,
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
  toggleExplorerReorderMode: () =>
    set((state) => {
      state.explorerReorderMode = !state.explorerReorderMode;
    }),
});
