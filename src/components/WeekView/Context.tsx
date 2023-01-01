import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import { useStore } from "@store/index";
import {
  type Lesson,
  type Timetable,
  type TimetableConfig,
} from "../../types/timetable";

const MIN_PER_ROW = 30;
const DISPLAYED_HOURS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];
const FIVE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SEVEN_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface IWeekViewContext {
  rows: number;
  cols: number;
  // Minute per row
  minPerRow: number;

  // Weekdays shown on the top
  weekdays: string[];
  // Hours shown on the left
  displayedHours: number[];

  showWeekend: boolean;

  personalTimetable: Timetable | null;
  personalTimetableConfig: TimetableConfig | null;

  minuteHeight: number;
  setMinuteHeight: Dispatch<SetStateAction<number>>;
  columnWidth: number;
  setColumnWidth: Dispatch<SetStateAction<number>>;

  openDetails: boolean;
  setOpenDetails: Dispatch<SetStateAction<boolean>>;
  detailsTimetable: Timetable | null;
  setDetailsTimetable: Dispatch<SetStateAction<Timetable | null>>;
  detailsLesson: Lesson | null;
  setdetailsLesson: Dispatch<SetStateAction<Lesson | null>>;

  // Convert row index to 12 hour time (e.g. 8 am)
  rowTo12: (i: number) => string;
}

interface Props {
  children: React.ReactNode;
}

const initialContext: IWeekViewContext = {
  rows: DISPLAYED_HOURS.length * (60 / MIN_PER_ROW),
  cols: FIVE_DAYS.length,
  minPerRow: MIN_PER_ROW,

  weekdays: FIVE_DAYS,
  displayedHours: DISPLAYED_HOURS,

  showWeekend: false,

  personalTimetable: null,
  personalTimetableConfig: null,

  minuteHeight: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMinuteHeight: () => {},
  columnWidth: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setColumnWidth: () => {},

  openDetails: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setOpenDetails: () => {},
  detailsTimetable: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDetailsTimetable: () => {},
  detailsLesson: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setdetailsLesson: () => {},

  rowTo12: (i: number) => {
    const h = DISPLAYED_HOURS[(i - 1) / 2];
    return h ? `${h % 12 || 12} ${h < 12 ? "am" : "pm"}` : "";
  },
};

export const WeekViewContext = createContext<IWeekViewContext>(initialContext);

export const WeekViewProvider = ({ children }: Props) => {
  const showWeekend = useStore.use.showWeekend();
  const personalTimetable = useStore.use.personalTimetable();
  const personalTimetableConfig = useStore.use.personalTimetableConfig();

  const weekdays = useMemo(
    () => (showWeekend ? SEVEN_DAYS : FIVE_DAYS),
    [showWeekend],
  );

  const [minuteHeight, setMinuteHeight] = useState(0);
  const [columnWidth, setColumnWidth] = useState(0);

  const [openDetails, setOpenDetails] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState<Timetable | null>(
    null,
  );
  const [detailsLesson, setdetailsLesson] = useState<Lesson | null>(null);

  return (
    <WeekViewContext.Provider
      value={{
        ...initialContext,
        weekdays,
        cols: weekdays.length,
        showWeekend,
        personalTimetable,
        personalTimetableConfig,
        minuteHeight,
        setMinuteHeight,
        columnWidth,
        setColumnWidth,
        openDetails,
        setOpenDetails,
        detailsTimetable,
        setDetailsTimetable,
        detailsLesson,
        setdetailsLesson,
      }}
    >
      {children}
    </WeekViewContext.Provider>
  );
};
