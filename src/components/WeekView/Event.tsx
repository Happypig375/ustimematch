import { useContext, useEffect, useState } from "react";
import { borderColor, textColor } from "@utils/shade";
import { parseTime } from "@utils/time";
import { type Lesson, type Timetable } from "../../types/timetable";
import { WeekViewContext } from "./Context";
import GridPeriod from "./Period";

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

  return (
    <GridPeriod
      begin={begin}
      end={end}
      color={color}
      weekday={weekday}
      // onClick={toggleShowDetailsModal}
      marginLeft={0}
    >
      <div
        style={{ color: textColor(color) }}
        className="flex flex-col gap-1 p-1 sm:p-[6px] leading-tight"
      >
        <div className="flex flex-wrap justify-between gap-x-1 text-[clamp(0.675rem,1.5vw,0.875rem)] font-medium">
          <span>{lessonName}</span>
          <span>{section}</span>
        </div>
        <span className="text-[clamp(0.6rem,1vw,0.75rem)] font-light">{`${parseTime(
          begin,
        )} - ${parseTime(end)}`}</span>
      </div>

      <div
        style={{ border: `1px solid ${borderColor(color)}` }}
        className="absolute top-0 left-0 h-full w-full"
      />
    </GridPeriod>
  );
};

export default CalendarEvent;
