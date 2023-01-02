import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useStore } from "@store/index";
import {
  type Lesson,
  type Timetable,
  type TimetableConfig,
} from "../../types/timetable";

const MIN_PER_ROW = 30;
// Because last hour isn't displayed, this is 1 less than the actual grid hour
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

  timetables: Timetable[];
  timetablesConfigs: TimetableConfig[];

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
  // Get indent level for overlapping lessons
  getIndent: (
    timetableId: string,
    lessonIndex: number,
    weekday: number,
    begin: string,
    end: string,
  ) => { indentLevel: number; totalLevels: number };
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

  timetables: [],
  timetablesConfigs: [],

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
  getIndent: () => ({ indentLevel: 0, totalLevels: 0 }),
};

export const WeekViewContext = createContext<IWeekViewContext>(initialContext);

export const WeekViewProvider = ({ children }: Props) => {
  const showWeekend = useStore.use.showWeekend();
  const personalTimetable = useStore.use.personalTimetable();
  const personalTimetableConfig = useStore.use.personalTimetableConfig();
  const timetables = useStore.use.timetables();
  const timetablesConfigs = useStore.use.timetablesConfigs();

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

  // This is probably an unoptimized solution
  // TODO: Find a better method
  const getIndent = useCallback<IWeekViewContext["getIndent"]>(
    (timetableId, lessonIndex, weekday, begin, end) => {
      // Note that personal timetable should always be at index 0 (Grid.tsx)

      // Combines all visible timtables
      const flattenTimetables = [
        ...(personalTimetable && personalTimetableConfig?.visible
          ? [personalTimetable]
          : []),
        ...timetables.filter((_, i) => timetablesConfigs[i]?.visible),
      ];

      // Combines all visible timetables configs
      const flattenTimetablesConfigs = [
        ...(personalTimetable && personalTimetableConfig?.visible
          ? [personalTimetableConfig]
          : []),
        ...timetablesConfigs.filter((config) => config.visible),
      ];

      // Cannot just pass timetableIndex because there are hidden timetables
      const timetableIndex = flattenTimetablesConfigs.findIndex(
        (config) => config.id === timetableId,
      );

      let totalLevels = 0;
      let indentLevel = 0;

      // For tracing all overlap
      let tmpBegin = begin;
      let tmpEnd = end;

      // Finding the indent level of a specific lesson
      for (let i = flattenTimetables.length - 1; i >= 0; i--) {
        const lessons = flattenTimetables[i]?.lessons[weekday];
        if (!lessons) continue;

        for (let j = 0; j < lessons.length; j++) {
          const lesson = lessons[j];
          if (!lesson) continue;

          let overlap = false;

          // https://stackoverflow.com/questions/13513932/algorithm-to-detect-overlapping-periods
          // String comparisoin works becuase the time is in "HH:mm"
          if (lesson.begin < tmpEnd && tmpBegin < lesson.end) {
            tmpBegin = lesson.begin;
            tmpEnd = lesson.end;
            overlap = true;
            if (i === timetableIndex) {
              tmpBegin = begin;
              tmpEnd = end;
            }
            if (i < timetableIndex) indentLevel += 1;
          }

          if (overlap) {
            totalLevels += 1;
          }
        }
      }

      // Another approach to get totalLevel
      // const totalLevels = flattenTimetables.length;

      // In case overlapping in the same timetable, although it shouldn't happen
      // Uses reverse for loop because z-index is higher for larger array index
      // tmpBegin = begin;
      // tmpEnd = end;
      // const tmpWeekday = flattenTimetables[timetableIndex]?.lessons[weekday];
      // if (!tmpWeekday) return { indentLevel, totalLevels };
      // let overlap = false;
      // for (let i = lessonIndex; i >= 0; i--) {
      //   const lesson = tmpWeekday[i];
      //   if (!lesson) continue;

      //   if (lesson.begin < tmpEnd && tmpBegin < lesson.end) {
      //     tmpBegin = lesson.begin;
      //     tmpEnd = lesson.end;

      //     overlap = true;
      //     if (i !== lessonIndex) indentLevel += 1;
      //   }
      // }
      // if (overlap) totalLevels += 1;

      return { indentLevel, totalLevels };
    },
    [personalTimetable, personalTimetableConfig, timetables, timetablesConfigs],
  );

  return (
    <WeekViewContext.Provider
      value={{
        ...initialContext,
        weekdays,
        cols: weekdays.length,
        showWeekend,
        personalTimetable,
        personalTimetableConfig,
        timetables,
        timetablesConfigs,
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
        getIndent,
      }}
    >
      {children}
    </WeekViewContext.Provider>
  );
};
