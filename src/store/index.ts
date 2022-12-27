import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./createSelectors";
import { type SettingsSlice, createSettingsSlice } from "./settings";
import { type TimetablesSlice, createTimetableSlice } from "./timetables";

const useStoreBase = create<SettingsSlice & TimetablesSlice>()(
  persist(
    immer(
      devtools((...a) => ({
        ...createSettingsSlice(...a),
        ...createTimetableSlice(...a),
      })),
    ),
    { name: "store" },
  ),
);

export const useStore = createSelectors(useStoreBase);
