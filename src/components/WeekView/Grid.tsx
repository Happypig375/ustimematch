import clsx from "clsx";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Border from "./Border";
import { WeekViewContext } from "./Context";
import CalendarEvent from "./Event";
import Period from "./Period";
import Timeline from "./Timeline";

const Grid = () => {
  const {
    showWeekend,
    cols,
    displayedHours,
    minPerRow,
    rowTo12,
    rows,
    weekdays,
    personalTimetable,
    personalTimetableConfig,
    setMinuteHeight,
    minuteHeight,
    setColumnWidth,
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

  /* ----------------------- Calculate height per minute ---------------------- */
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
    // handleResize();
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
    const refClone = gridRef.current;
    if (!refClone) return;

    const ro = new ResizeObserver(handleResize);
    ro.observe(refClone);

    return () => ro.unobserve(refClone);
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [showWeekend, handleResize]);

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
          className={clsx(
            "flex select-none items-center justify-center p-2 leading-none",
            new Date().getDay() === i + 1
              ? "font-medium text-brand"
              : "text-text-black-100/80",
          )}
          style={{ gridRowStart: 1, gridColumnStart: i + 2 }}
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
            <div className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap pr-2 text-gray-600">
              {rowTo12(i)}
            </div>
          )}
        </div>
      ))}

      <Border />

      {/* --------------------------- Personal timetable --------------------------- */}
      {personalTimetableConfig.visible &&
        personalTimetable?.lessons.map((lessons, i) =>
          lessons.map((lessons, j) => (
            <CalendarEvent
              key={`${i}${j}`}
              weekday={i}
              color={personalTimetable.color}
              lesson={lessons}
            />
          )),
        )}

      {/* -------------------------- Timematch or lessons -------------------------- */}
      {/* {showTimematch ? (
      <>
        {!loading &&
          timematch.map((week, i) =>
            week.map((period, j) => (
              <GridPeriod
                key={`${i}${j}`}
                color="#99ee99"
                gridHour={HOUR}
                minutePerRow={MIN_PER_ROW}
                minuteHeight={minuteHeight}
                weekday={i}
                marginLeft={0}
                end={period.end}
                begin={period.begin}
              >
                <p className="px-1 py-[2px] text-[0.675rem] leading-tight text-[#004400] sm:px-2 sm:py-[6px] sm:text-[0.775rem] sm:font-medium">
                  {parseTime(period.begin)} - {parseTime(period.end)}
                </p>
              </GridPeriod>
            ))
          )}
      </>
    ) : (
      <>
        {calendars.map((cal, i) => {
          return (
            cal.visible &&
            cal.lessons.map((lsns, j) =>
              lsns.map((lsn, k) => (
                <CalendarEvent
                  key={`${i}${j}${k}`}
                  gridTime={HOUR}
                  weekday={j}
                  color={cal.color}
                  lesson={lsn}
                  calName={cal.name}
                  minuteHeight={minuteHeight}
                  minutePerRow={MIN_PER_ROW}
                  openModal={showModal}
                  calendars={calendars}
                />
              ))
            )
          );
        })}
      </>
    )} */}

      <Timeline />

      {/* {loading && (
      <div className="col-[2/-1] row-[2/-1] flex items-center justify-center">
        <Spinner className="h-8 w-8 text-gray-600" />
      </div>
    )}

    {person && lesson && (
      <DetailsModal
        person={person}
        lesson={lesson}
        open={detailsModal}
        close={toggleDetailsModal}
      />
    )} */}
    </div>
  );
};

export default Grid;
