import clsx from "clsx";
import { useCallback, useContext, useEffect, useRef } from "react";
import { type Lesson, type Timetable } from "../../types/timetable";
import Border from "./Border";
import { WeekViewContext } from "./Context";
import DetailsModal from "./DetailsModal";
import Event from "./Event";
import Timeline from "./Timeline";

const Grid = () => {
  const {
    rows,
    cols,
    minPerRow,
    weekdays,
    showWeekend,
    personalTimetable,
    personalTimetableConfig,
    setMinuteHeight,
    setColumnWidth,
    openDetails,
    setOpenDetails,
    setDetailsTimetable,
    setdetailsLesson,
    rowTo12,
  } = useContext(WeekViewContext);

  /* ---------- Fetch timematch when calendars change or when toggled --------- */
  // useEffect(() => {
  //   if (!showTimematch) return;
  //   getTimematch();
  // }, [showTimematch, calendars, getTimematch]);

  /* ------------------ Function passed as prop to open modal ----------------- */
  // const [detailsModal, setDetailsModal] = useState(false);

  // const [person, setPerson] = useState<string | undefined>();
  // const [lesson, setLesson] = useState<Lesson | undefined>();

  // const toggleDetailsModal = () => setDetailsModal(!detailsModal);

  // const showModal = (name: string, lesson: Lesson) => {
  //   setPerson(name);
  //   setLesson(lesson);
  //   toggleDetailsModal();
  // };

  const toggleOpenDetails = useCallback(
    (timetable: Timetable, lesson: Lesson) => {
      setDetailsTimetable(timetable);
      setdetailsLesson(lesson);
      setOpenDetails(!openDetails);
    },
    [setDetailsTimetable, setdetailsLesson, openDetails, setOpenDetails],
  );

  // Resize oberver for calculating height of a minute
  const gridRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const weekdayRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const weekdayRect = weekdayRef.current?.getBoundingClientRect();
    const timeRect = timeRef.current?.getBoundingClientRect();

    if (!weekdayRect || !timeRect) return;

    setMinuteHeight(timeRect.height / minPerRow);
    setColumnWidth(weekdayRect.width);
  }, [minPerRow, setMinuteHeight, setColumnWidth]);

  useEffect(() => {
    const ref = gridRef.current;
    if (!ref) return;

    const ro = new ResizeObserver(handleResize);
    ro.observe(ref);

    return () => ro.unobserve(ref);
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [handleResize, showWeekend]);

  return (
    <div
      ref={gridRef}
      className="grid h-full overflow-y-auto"
      style={{
        gridTemplateRows: `auto repeat(${rows}, minmax(16px,1fr))`,
        gridTemplateColumns: `auto repeat(${cols}, minmax(0,1fr))`,
      }}
    >
      {/* First row weekday */}
      {weekdays.map((v, i) => (
        <div
          key={i}
          // For measuring width of columns (second column)
          ref={i === 0 ? weekdayRef : undefined}
          style={{ gridRowStart: 1, gridColumnStart: i + 2 }}
          className={clsx(
            "flex select-none items-center justify-center p-2 leading-none",
            new Date().getDay() === (i + 1) % 7
              ? "font-medium text-brand"
              : "text-text-black-100",
          )}
        >
          {v}
        </div>
      ))}

      {/* First column time */}
      {Array.from(Array(rows + 1), (_, i) => (
        <div
          key={i}
          // For measuring height of rows (second row)
          ref={i === 1 ? timeRef : undefined}
          style={{ gridRowStart: i + 1, gridColumnStart: 1 }}
          className="relative select-none pl-[4em] text-xs sm:pl-[5em]"
        >
          {(i + 1) % 2 === 0 && (
            <div className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap pr-2 text-text-black-100">
              {rowTo12(i)}
            </div>
          )}
        </div>
      ))}

      <Border />

      {/* Personal timetable */}
      {personalTimetableConfig?.visible &&
        personalTimetable?.lessons.map((weekday, i) =>
          weekday.map((lesson, j) => (
            <Event
              key={`${i}${j}`}
              weekday={i}
              lesson={lesson}
              color={personalTimetable.color}
              onClick={() => toggleOpenDetails(personalTimetable, lesson)}
            />
          )),
        )}

      <Timeline />

      <DetailsModal />
    </div>
  );
};

export default Grid;
