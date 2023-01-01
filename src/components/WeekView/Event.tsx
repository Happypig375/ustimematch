import { motion } from "framer-motion";
import { borderColor, textColor } from "@utils/shade";
import { parseTime } from "@utils/time";
import { type Lesson } from "../../types/timetable";
import GridPeriod, { HoverContext } from "./Period";
import { parseUSTName } from "@utils/parseName";

type Props = {
  // 0 to 6: moneday to sunday
  weekday: number;
  color: string;
  lesson: Lesson;
  onClick: () => void;
  // timetableName: string;

  // openModal: (name: string, lsn: Lesson) => void;
};

const CalendarEvent = ({
  color,
  weekday,
  onClick,
  lesson: { name, venue, begin, end },
}: // timetableName,
// openModal,
Props) => {
  // const toggleShowDetailsModal = () =>
  //   openModal(timetableName, { begin, end, description, venue, name });

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
      color={color}
      weekday={weekday}
      onClick={onClick}
      marginLeft={0}
      begin={begin}
      end={end}
    >
      <HoverContext.Consumer>
        {({ hover, matchDesktop, hoverTransition, idleTransition }) => (
          <>
            {/* Main content */}
            <div className="flex flex-col gap-1 px-1 py-[5px] leading-none sm:gap-2 sm:px-[7px] sm:py-2">
              <div
                style={{ color: textColor(color) + "ee" }}
                className="flex flex-wrap justify-between gap-x-2 gap-y-1 text-[clamp(0.675rem,1.4vw,0.875rem)] font-medium"
              >
                <div>{parseUSTName(name).lessonName}</div>
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
                  {parseUSTName(name).section}
                </motion.div>
              </div>

              <div className="flex flex-col gap-1 text-[clamp(0.6rem,1.2vw,0.7rem)] sm:gap-2">
                <div style={{ color: textColor(color) + "cc" }}>
                  {`${parseTime(begin)} - ${parseTime(end)}`}
                </div>
                <div style={{ color: textColor(color) + "aa" }}>{venue}</div>
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
