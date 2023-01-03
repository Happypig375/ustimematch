import { motion } from "framer-motion";
import { parseUSTName } from "@utils/parseName";
import { textColor } from "@utils/shade";
import { parseTime } from "@utils/time";
import { type Lesson } from "../../types/timetable";
import GridPeriod, { HoverContext } from "./Period";

type Props = {
  color: string;
  weekday: number;
  indent: { indentLevel: number; totalLevels: number };
  lesson: Lesson;
  onClick: () => void;
};

const CalendarEvent = ({
  color,
  weekday,
  indent,
  lesson: { name, venue, begin, end },
  onClick,
}: Props) => {
  return (
    <GridPeriod
      color={color}
      weekday={weekday}
      onClick={onClick}
      indent={indent}
      begin={begin}
      end={end}
    >
      <HoverContext.Consumer>
        {({ hover, matchDesktop, hoverTransition, idleTransition }) => (
          <>
            {/* Main content */}
            <div className="flex flex-col gap-1 p-1 leading-none sm:gap-2 sm:p-[6px]">
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
                      opacity: 1,
                      display: "block",
                      transition: hoverTransition,
                    },
                    idle: {
                      opacity: 0,
                      display: "none",
                      transition: idleTransition,
                    },
                  }}
                >
                  {parseUSTName(name).section}
                </motion.div>
              </div>

              {/* TODO: settings for toggling visible previews */}
              <div className="flex flex-col gap-1 text-[clamp(0.6rem,1.2vw,0.7rem)] sm:gap-2">
                <div style={{ color: textColor(color) + "cc" }}>
                  {`${parseTime(begin)} - ${parseTime(end)}`}
                </div>
                <div style={{ color: textColor(color) + "aa" }}>{venue}</div>
              </div>
            </div>
          </>
        )}
      </HoverContext.Consumer>
    </GridPeriod>
  );
};

export default CalendarEvent;
