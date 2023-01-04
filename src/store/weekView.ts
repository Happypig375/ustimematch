import { createStore } from "@udecode/zustood";
import { type Lesson, type Timetable } from "../types/timetable";

interface WeekViewStore {
  openDetails: boolean;
  detailsTimetable: Timetable | null;
  detailsLesson: Lesson | null;
  minuteHeight: number;
}

export const weekViewStore = createStore("weekView")<WeekViewStore>(
  {
    openDetails: false,
    detailsTimetable: null,
    detailsLesson: null,

    // Default value when height haven't been calculated
    minuteHeight: 0,
  },
  { devtools: { enabled: true } },
).extendActions((set) => ({
  setOpenDetails: (openDetails: boolean) => {
    set.state((draft) => {
      draft.openDetails = openDetails;
    });
  },
  setDetailsTimetable: (detailsTimetable: Timetable) => {
    set.state((draft) => {
      draft.detailsTimetable = detailsTimetable;
    });
  },
  setDetailsLesson: (detailsLesson: Lesson) => {
    set.state((draft) => {
      draft.detailsLesson = detailsLesson;
    });
  },
  setMinuteHeight: (minuteHeight: number) => {
    set.state((draft) => {
      draft.minuteHeight = minuteHeight;
    });
  },
}));
