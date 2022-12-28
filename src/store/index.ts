import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./createSelectors";
import { type StatesSlice, createStatesSlice } from "./states";
import { type TimetablesSlice, createTimetableSlice } from "./timetables";

const useStoreBase = create<StatesSlice & TimetablesSlice>()(
  persist(
    immer(
      devtools((...a) => ({
        ...createStatesSlice(...a),
        ...createTimetableSlice(...a),
      })),
    ),
    { name: "store" },
  ),
);

export const useStore = createSelectors(useStoreBase);
