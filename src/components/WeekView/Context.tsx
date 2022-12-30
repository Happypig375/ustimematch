import { createContext, useMemo } from "react";
import { useStore } from "@store/index";
import { type Timetable, type TimetableConfig } from "../../types/timetable";

interface IWeekViewContext {
  rows: number;
  cols: number;
  minPerRow: number;
  showWeekend: boolean;
  weekdays: string[];
  displayedHours: number[];
  rowTo12: (i: number) => string;
  personalTimetable: Timetable | null;
  personalTimetableConfig: TimetableConfig;
}

interface Props {
  children: React.ReactNode;
}

const MIN_PER_ROW = 30;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const initialContext: IWeekViewContext = {
  minPerRow: 30,
  // Hours shown on the left
  displayedHours: HOURS,
  // Number of rows
  rows: HOURS.length * (60 / MIN_PER_ROW),
  cols: 7,
  showWeekend: true,
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  // Convert row index to 12 hour time (8 am)
  rowTo12: (i: number) => {
    const h = HOURS[(i - 1) / 2];
    return h ? `${h % 12 || 12} ${h < 12 ? "am" : "pm"}` : "";
  },
  personalTimetable: null,
  personalTimetableConfig: { visible: true },
};

export const WeekViewContext = createContext<IWeekViewContext>(initialContext);

export const WeekViewProvider = ({ children }: Props) => {
  const showWeekend = useStore.use.showWeekend();
  const personalTimetable = useStore.use.personalTimetable();
  const personalTimetableConfig = useStore.use.personalTimetableConfig();

  const weekdays = useMemo(
    () =>
      showWeekend
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri"],
    [showWeekend],
  );

  return (
    <WeekViewContext.Provider
      value={{
        ...initialContext,
        showWeekend,
        weekdays,
        cols: weekdays.length,
        personalTimetable,
        personalTimetableConfig,
      }}
    >
      {children}
    </WeekViewContext.Provider>
  );
};
