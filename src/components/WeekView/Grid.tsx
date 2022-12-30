import clsx from "clsx";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useStore } from "@store/index";
import { useDate } from "@hooks/useCurrentTime";
import { WeekViewContext, WeekViewProvider } from "./Context";
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
  const [minuteHeight, setMinuteHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const firstRow = ref.current?.children
      .item(cols + 1)
      ?.getBoundingClientRect().height;

    if (!firstRow) return;
    setMinuteHeight(firstRow / minPerRow);
  }, [cols, minPerRow]);

  useEffect(() => {
    // handleResize();
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
    const refClone = ref.current;
    if (!refClone) return;

    const ro = new ResizeObserver(handleResize);
    ro.observe(refClone);

    return () => ro.unobserve(refClone);
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [showWeekend, handleResize]);

  const { date } = useDate();

  return (
    <div
      ref={ref}
      className="grid h-full overflow-y-auto"
      // className="overfloy-y-auto grid h-full min-h-[480px] overflow-x-hidden"
      style={{
        // add ability of pinch to grow / shrink
        gridTemplateRows: `auto repeat(${rows}, minmax(16px,1fr))`,
        gridTemplateColumns: `auto repeat(${cols}, minmax(0,1fr))`,
      }}
    >
      {/* ---------------------------- First row weekday --------------------------- */}
      {weekdays.map((v, i) => (
        <span
          key={i}
          className={clsx(
            "flex items-center justify-center border-b-[0.5px] border-gray-300 p-2 leading-none text-gray-600",
            date.getDay() === i + 1
              ? "text-text-black-100"
              : "text-text-black-100/50",
          )}
          style={{ gridRowStart: 1, gridColumnStart: i + 2 }}
        >
          {v}
        </span>
      ))}

      {/* ---------------------------- First column time --------------------------- */}
      {Array.from(Array(rows + 1), (_, i) => (
        <div
          key={i}
          style={{ gridRowStart: i + 1, gridColumnStart: 1 }}
          className="relative pl-[4em] text-xs md:pl-[5em]"
        >
          {(i + 1) % 2 === 0 && (
            <span className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap pr-2 text-gray-600">
              {rowTo12(i)}
            </span>
          )}
        </div>
      ))}

      {/* ------------------------------- Grid border ------------------------------ */}
      {Array.from(Array(rows * cols), (_, i) => (
        <div
          key={i}
          className={`border-[0.5px] border-gray-300 ${
            // no border left if cell at leftmost
            i % cols === 0 ? "border-l-0" : ""
            // no border right if cell at rightmost
          } ${(i + 1) % cols === 0 ? "border-r-0" : ""} ${
            // no border bottom if cell at bottommost
            i > cols * rows - cols - 1 ? "border-b-0" : ""
          } ${
            // even border lighter
            Math.floor(i / cols) % 2
              ? "border-t-gray-300/50"
              : "border-b-gray-300/50"
          } ${
            ["Sat", "Sun"].includes(weekdays[i % cols] as string)
              ? "bg-gray-200/40"
              : ""
          }`}
          style={{
            gridRowStart: Math.floor(i / cols) + 2,
            gridColumnStart: (i % cols) + 2,
          }}
        />
      ))}

      {/* --------------------------- Personal timetable --------------------------- */}
      {personalTimetableConfig.visible &&
        personalTimetable?.lessons.map((lessons, i) =>
          lessons.map((lessons, j) => (
            <CalendarEvent
              key={`${i}${j}`}
              weekday={i}
              color={personalTimetable.color}
              lesson={lessons}
              minuteHeight={minuteHeight}
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
                <p className="px-1 py-[2px] text-[0.675rem] leading-tight text-[#004400] md:px-2 md:py-[6px] md:text-[0.775rem] md:font-medium">
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

      <Timeline minuteHeight={minuteHeight} />

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
