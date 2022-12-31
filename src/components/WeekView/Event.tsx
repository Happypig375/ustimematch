import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import useMediaQuery from "@hooks/useMediaQuery";
import { borderColor, secondaryTextColor, textColor } from "@utils/shade";
import { parseTime } from "@utils/time";
import { type Lesson, type Timetable } from "../../types/timetable";
import { WeekViewContext } from "./Context";
import GridPeriod, { HoverContext } from "./Period";

type Props = {
  // 0 to 6: moneday to sunday
  weekday: number;
  color: string;
  lesson: Lesson;
  // timetableName: string;

  // openModal: (name: string, lsn: Lesson) => void;
};

const CalendarEvent = ({
  weekday,
  lesson: { begin, end, description, venue, name },
  color,
}: // timetableName,
// openModal,
Props) => {
  const {
    showWeekend,
    cols,
    displayedHours,
    rowTo12,
    rows,
    weekdays,
    personalTimetable,
    personalTimetableConfig,
    minuteHeight,
  } = useContext(WeekViewContext);

  // const toggleShowDetailsModal = () =>
  //   openModal(timetableName, { begin, end, description, venue, name });

  const lessonName = name.split(" (")[0] || "";
  const section = name.split(" ")[2]?.replace(/[()]/g, "") || "";

  // const [marginLeft, setMarginLeft] = useState<number | undefined>(undefined);

  // useEffect(() => {
  //   const visibleCal = calendars.filter((v) => v.visible);
  //   const visibleLen = visibleCal.length;
  //   const calIdx = visibleCal.findIndex((v) => v.name === calName);

  //   let ml = 0;
  //   let tmpBegin = begin;
  //   let tmpEnd = end;

  //   for (let i = calIdx - 1; i >= 0; i--) {
  //     const lessons = visibleCal[i].lessons[weekday];

  //     for (let j = 0; j < lessons.length; j++) {
  //       if (lessons[j].begin < tmpEnd && tmpBegin < lessons[j].end) {
  //         tmpBegin = lessons[j].begin;
  //         tmpEnd = lessons[j].end;
  //         ml += visibleLen > 3 ? 100 / visibleLen : 30;
  //       }
  //     }
  //   }

  //   setMarginLeft(ml);
  // }, [calendars, begin, calName, end, weekday]);

  const matchTouch = useMediaQuery("(pointer: fine)");

  return (
    <GridPeriod
      begin={begin}
      end={end}
      color={color}
      weekday={weekday}
      // onClick={toggleShowDetailsModal}
      marginLeft={0}
    >
      <HoverContext.Consumer>
        {({ hover, matchDesktop, hoverTransition, idleTransition }) => (
          <>
            {/* Main content */}
            <div className="flex flex-col gap-1 px-1 py-[5px] leading-none sm:gap-2 sm:px-2 sm:py-[9px]">
              <div
                style={{ color: textColor(color) }}
                className={
                  "flex flex-wrap justify-between gap-x-2 gap-y-1 text-[clamp(0.675rem,1.5vw,0.875rem)] font-medium"
                }
              >
                <div>{lessonName}</div>
                <motion.div
                  initial={false}
                  animate={matchDesktop ? "hover" : hover ? "hover" : "idle"}
                  variants={{
                    hover: {
                      scale: 1,
                      opacity: 1,
                      display: "block",
                      transition: hoverTransition,
                    },
                    idle: {
                      scale: 0,
                      opacity: 0,
                      display: "none",
                      transition: idleTransition,
                    },
                  }}
                >
                  {section}
                </motion.div>
              </div>

              <div
                style={{ color: secondaryTextColor(color) }}
                className="text-[clamp(0.6rem,1vw,0.7rem)]"
              >
                {`${parseTime(begin)} - ${parseTime(end)}`}
              </div>
            </div>

            {/* Border hack */}
            <div
              style={{ border: `1px solid ${borderColor(color)}` }}
              className="absolute top-0 left-0 h-full w-full"
            />
          </>
        )}
      </HoverContext.Consumer>
    </GridPeriod>
  );
};

export default CalendarEvent;
