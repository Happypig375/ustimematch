import { createStore } from "@udecode/zustood";

// Constant that is used to calculate grid position (Period.tsx)
// This shouldn't be modified
const MINUTE_PER_ROW = 30;

// Hours shown on weekview's first column
// Only the ones that are displayed! (the grid actually shows times until 23:00)
// The numbers have to be in 24-hour format for calculating grid position (Period.tsx)
// const DISPLAYED_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const DISPLAYED_HOURS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];

// Weekdays shown on weekview's first row
const FIVE_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SEVEN_WEEKDAYS = [...FIVE_WEEKDAYS, "Sat", "Sun"];

export const uiStore = createStore("ui")(
  {
    showWeekend: true,
    showExplorer: true,
    showTimematch: false,
    explorerReorderMode: false,
  },
  { devtools: { enabled: true }, persist: { enabled: true } },
)
  .extendSelectors((_, get) => ({
    minutePerRow: () => MINUTE_PER_ROW,
    displayedHours: () => DISPLAYED_HOURS,
    weekdays: () => (get.showWeekend() ? SEVEN_WEEKDAYS : FIVE_WEEKDAYS),
  }))
  .extendSelectors((_, get) => ({
    weekViewRows: () => DISPLAYED_HOURS.length * (60 / MINUTE_PER_ROW),
    weekViewCols: () => get.weekdays().length,
  }))
  .extendActions((set) => ({
    toggleShowWeekend: () => {
      set.state((draft) => {
        draft.showWeekend = !draft.showWeekend;
      });
    },
    toggleshowExplorer: () => {
      set.state((draft) => {
        draft.showExplorer = !draft.showExplorer;
      });
    },
    toggleShowTimematch: () => {
      set.state((draft) => {
        draft.showTimematch = !draft.showTimematch;
      });
    },
    toggleExplorerReorderMode: () => {
      set.state((draft) => {
        draft.explorerReorderMode = !draft.explorerReorderMode;
      });
    },
  }));
