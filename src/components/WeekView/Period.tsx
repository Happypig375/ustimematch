import { motion, type Transition } from "framer-motion";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useMediaQuery from "@hooks/useMediaQuery";
import usePrevious from "@hooks/usePrevious";
import { hour, min } from "@utils/time";
import { WeekViewContext } from "./Context";

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

interface Props {
  weekday: number;
  begin: string;
  end: string;
  color: string;
  indent?: { indentLevel: number; totalLevels: number };
  children?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Base component for rendering a period on grid
 *
 * Handles grid positioning and exposes hover context
 */
const Period = ({
  weekday,
  begin: tmpBegin,
  end: tmpEnd,
  color,
  indent,
  children,
  onClick,
}: Props) => {
  const { showWeekend, displayedHours, minPerRow, minuteHeight } =
    useContext(WeekViewContext);

  // Check if period exceeds displayed hours or if it is on weekend but weekend is hidden
  const periodOverflow = useMemo(
    () =>
      (!showWeekend && weekday > 4) ||
      hour(tmpEnd) < (displayedHours[0] as number) ||
      hour(tmpBegin) > (displayedHours[displayedHours.length - 1] as number),
    [showWeekend, weekday, displayedHours, tmpBegin, tmpEnd],
  );

  // Constrain period by displayed hours if it is partially visible, otherwise begin and end will be tmpBegin and tmpEnd
  const begin = useMemo(
    () =>
      hour(tmpBegin) < (displayedHours[0] as number)
        ? `${displayedHours[0]}:00`
        : tmpBegin,
    [displayedHours, tmpBegin],
  );
  const end = useMemo(
    () =>
      hour(tmpEnd) > (displayedHours[displayedHours.length - 1] as number)
        ? `${(displayedHours[displayedHours.length - 1] as number) + 1}:00`
        : tmpEnd,
    [displayedHours, tmpEnd],
  );

  // Calculate grid position
  const gridRowStart = useMemo(
    () =>
      hour(begin) >= (displayedHours[0] as number)
        ? ((hour(begin) - (displayedHours[0] as number)) * 60 +
            (Math.floor(min(begin) / minPerRow) ? minPerRow : 0)) /
            minPerRow +
          2
        : 2,
    [begin, displayedHours, minPerRow],
  );
  const gridRowEnd = useMemo(
    () =>
      hour(end) <= (displayedHours[displayedHours.length - 1] as number)
        ? ((hour(end) - (displayedHours[0] as number)) * 60 +
            (Math.ceil(min(end) / minPerRow)
              ? Math.ceil(min(end) / minPerRow) * minPerRow
              : 0)) /
            minPerRow +
          2
        : displayedHours.length * 2 + 2,
    [displayedHours, end, minPerRow],
  );

  // Calculate grid offset
  const periodMin = useMemo(
    () => (hour(end) - hour(begin)) * 60 + min(end) - min(begin),
    [begin, end],
  );
  const minPrefix = useMemo(
    () => (min(begin) >= minPerRow ? min(begin) - minPerRow : min(begin)),
    [begin, minPerRow],
  );

  // If period touches bottom (last 30mins period)
  const isBottom = useMemo(
    () => end === `${displayedHours[displayedHours.length - 1]}:30`,
    [displayedHours, end],
  );
  // If period touches right
  const isRight = useMemo(
    () => (showWeekend ? weekday === 6 : weekday === 4),
    [showWeekend, weekday],
  );

  // Hover effect
  // Matching touch screen devices
  const matchTouch = useMediaQuery("(pointer: coarse)");
  // Matching tailwind's sm: breakpoint
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  const HOVER_MARGIN = useMemo(
    () => (minPerRow * minuteHeight) / (matchDesktop ? 1.5 : 1.25),
    [matchDesktop, minPerRow, minuteHeight],
  );

  const [hover, setHover] = useState(false);
  const prevHover = usePrevious(hover);
  const onHoverStart = () => setHover(true);
  const onHoverEnd = () => setHover(false);

  const height = useMemo(
    () =>
      minuteHeight * periodMin + (!isBottom && hover ? HOVER_MARGIN * 2 : 0),
    [HOVER_MARGIN, isBottom, minuteHeight, periodMin, hover],
  );

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
      // BUG: mobile devices interrupt hover will not trigger exit
      // FIX: mobal uses higher z-index (not full fix)

      // Delay hover exit for better viewing on mobile devices
      // prevHover is used becuase hover is always false when animation is in idle state, so cannot just use hover.
      delay: matchTouch && prevHover ? 1.5 : 0,
    }),
    [matchTouch, prevHover],
  );

  // Check minuteHeight for preventing initial height animation
  return minuteHeight && !periodOverflow ? (
    <motion.div
      onClick={() => {
        onClick && onClick();
        // To prevent hover persist
        // This case is to prevent hover persist when details modal is shown
        onHoverEnd();
      }}
      style={{
        // + 1 because grid is 1-indexed
        // + 1 because first row is weekday
        gridColumnStart: weekday + 2,
        gridRowStart,
        gridRowEnd,
      }}
      // Relative is for absolute border hack (Event.tsx)
      className="relative cursor-pointer select-none overflow-hidden"
      initial={false}
      onHoverEnd={onHoverEnd}
      onHoverStart={onHoverStart}
      animate={hover ? "hover" : "idle"}
      // TODO: optimize hover sizing
      variants={{
        hover: {
          height,
          zIndex: 10,
          marginLeft: matchDesktop ? "-17.5%" : "-40%",
          marginRight: !isRight ? (matchDesktop ? "-17.5%" : "-40%") : 0,
          backgroundColor: color + "f8",
          marginTop: -HOVER_MARGIN + minuteHeight * minPrefix,
          transition: hoverTransition,
        },
        idle: {
          height,
          zIndex: 0,
          marginLeft: indent
            ? indent.totalLevels < 3
              ? // Make the first ident level less deep, more visually balanced
                `${indent.indentLevel * 40}%`
              : `${indent.indentLevel * (100 / indent.totalLevels)}%`
            : 0,
          marginRight: 0,
          backgroundColor: color + "e8",
          marginTop: minuteHeight * minPrefix,
          transition: idleTransition,
        },
      }}
    >
      <HoverContext.Provider
        value={{
          hover,
          matchTouch,
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

export default Period;
