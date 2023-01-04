import { mapValuesKey } from "@udecode/zustood";
import { timetableStore } from "./timetable";
import { uiStore } from "./ui";
import { weekViewStore } from "./weekView";

// Global store
export const rootStore = {
  ui: uiStore,
  timetable: timetableStore,
  weekView: weekViewStore,
};

// Global hook selectors
export const useStore = () => mapValuesKey("use", rootStore);

// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey("useTracked", rootStore);

// Global getter selectors
export const store = mapValuesKey("get", rootStore);

// Global actions
export const actions = mapValuesKey("set", rootStore);
