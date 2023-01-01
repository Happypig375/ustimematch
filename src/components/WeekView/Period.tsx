import { motion, Transition } from "framer-motion";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import useMediaQuery from "@hooks/useMediaQuery";
import { hour, min } from "@utils/time";
import { WeekViewContext } from "./Context";

type Props = {
  weekday: number;
  color: string;
  begin: string;
  end: string;

  marginLeft?: number;
  children?: React.ReactNode;
  onClick?: () => void;
};

interface IHoverContext {
  hover: boolean;
  matchTouch: boolean;
  matchDesktop: boolean;
  idleTransition: Transition;
  hoverTransition: Transition;
}

export const HoverContext = createContext<IHoverContext>({
  hover: false,
  matchTouch: false,
  matchDesktop: false,
  idleTransition: {},
  hoverTransition: {},
});

const GridPeriod = ({
  weekday,
  color,
  begin,
  end,
  marginLeft,
  children,
  onClick,
}: Props) => {
  const { showWeekend, displayedHours, minPerRow, minuteHeight, openDetails } =
    useContext(WeekViewContext);

  // if period reach last row
  const isBottom = () =>
    end > `${displayedHours[displayedHours.length - 1]}:30`;
  const isRight = () => (showWeekend ? weekday === 6 : weekday === 4);

  // 2-indexed (1-indexed grid + 1 col time)
  const gridColumnStart = weekday + 2;

  // constrain to time within grid
  const beginOverflow = hour(begin) < (displayedHours[0] as number);
  const endOverflow =
    hour(end) > (displayedHours[displayedHours.length - 1] as number);
  if (beginOverflow) begin = `${displayedHours[0]}:00`;
  if (endOverflow) end = `${displayedHours[displayedHours.length - 1]}:59`;

  const rowBegin =
    ((hour(begin) - (displayedHours[0] as number)) * 60 +
      (Math.floor(min(begin) / minPerRow) ? minPerRow : 0)) /
      minPerRow +
    2;
  const rowEnd =
    ((hour(end) - (displayedHours[0] as number)) * 60 +
      (Math.ceil(min(end) / minPerRow)
        ? Math.ceil(min(end) / minPerRow) * minPerRow
        : 0)) /
      minPerRow +
    2;

  const minPrefix =
    min(begin) >= minPerRow ? min(begin) - minPerRow : min(begin);

  const periodMin = (hour(end) - hour(begin)) * 60 + min(end) - min(begin);

  // 2-indexed (1-indexed grid + 1 row weekday)
  const gridRowStart =
    hour(begin) >= (displayedHours[0] as number) ? rowBegin : 2;
  const gridRowEnd =
    hour(end) <= (displayedHours[displayedHours.length - 1] as number)
      ? rowEnd
      : displayedHours.length * 2 + 2;

  // Hover effect
  const matchMouse = useMediaQuery("(pointer: fine)");
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  const HOVER_MARGIN = (minPerRow * minuteHeight) / (matchDesktop ? 1.5 : 1.25);

  const [hover, setHover] = useState(false);

  const onHoverStart = () => setHover(true);
  const onHoverEnd = () => setHover(false);

  const hoverTransition = useMemo(
    () => ({
      type: "spring",
      duration: 0.3,
      bounce: 0,
      delay: 0.3,
    }),
    [],
  );

  const idleTransition = useMemo(
    () => ({
      type: "spring",
      duration: 0.3,
      bounce: 0,
      // Delay hover exit for better viewing on mobile devices
      // BUG: mobile devices interrupt hover will not trigger exit
      delay: openDetails || matchMouse ? 0 : 2,
    }),
    [openDetails, matchMouse],
  );

  return minuteHeight && !(!showWeekend && weekday > 4) ? (
    <motion.div
      variants={{
        hover: {
          zIndex: 10,
          marginLeft: matchDesktop ? "-17.5%" : "-40%",
          marginRight: !isRight() ? (matchDesktop ? "-17.5%" : "-40%") : 0,
          height:
            minuteHeight * periodMin + (!isBottom() ? HOVER_MARGIN * 2 : 0),
          backgroundColor: color + "ee",
          marginTop: -HOVER_MARGIN + minuteHeight * minPrefix,
          transition: hoverTransition,
        },
        idle: {
          zIndex: 0,
          marginLeft: 0,
          marginRight: 0,
          height: minuteHeight * periodMin,
          backgroundColor: color + "cc",
          marginTop: minuteHeight * minPrefix,
          transition: idleTransition,
        },
      }}
      initial={false}
      animate={!openDetails && hover ? "hover" : "idle"}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      // Relative for absolute border hack (Event.tsx)
      className="relative cursor-pointer select-none overflow-hidden"
      style={{
        gridColumnStart,
        gridRowStart,
        gridRowEnd,
      }}
      onClick={onClick}
    >
      <HoverContext.Provider
        value={{
          hover,
          matchTouch: matchMouse,
          matchDesktop,
          hoverTransition,
          idleTransition,
        }}
      >
        {children}
      </HoverContext.Provider>
    </motion.div>
  ) : null;
};

export default GridPeriod;
