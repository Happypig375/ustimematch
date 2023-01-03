import { motion, type Transition } from "framer-motion";
import { createContext, useContext, useMemo, useState } from "react";
import useMediaQuery from "@hooks/useMediaQuery";
import usePrevious from "@hooks/usePrevious";
import { borderColor } from "@utils/shade";
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

  // Length of period in minutes
  const periodMin = useMemo(
    () => (hour(end) - hour(begin)) * 60 + min(end) - min(begin),
    [begin, end],
  );

  // Calculate grid offset (how many mins from the beginning of hour)
  const minPrefix = useMemo(
    () => (min(begin) >= minPerRow ? min(begin) - minPerRow : min(begin)),
    [begin, minPerRow],
  );

  // Hover effect
  const [hover, setHover] = useState(false);
  const prevHover = usePrevious(hover);

  const onHoverStart = () => setHover(true);
  const onHoverEnd = () => setHover(false);

  // Matching touch screen devices
  const matchTouch = useMediaQuery("(pointer: coarse)");
  // Matching tailwind's sm: breakpoint
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  // Control vertical hover offset, and constrain hover effect by grid border (right and bottom)
  // If period cannot be expanded
  const isBottom = useMemo(
    () => end > `${displayedHours[displayedHours.length - 1]}:30`,
    [displayedHours, end],
  );
  const yOffset = useMemo(
    () => minPerRow * minuteHeight * (matchDesktop ? 0.8 : 0.9),
    [matchDesktop, minPerRow, minuteHeight],
  );
  const height = useMemo(
    () =>
      minuteHeight * periodMin +
      // yOffset * 2 to account for marginTop and "marginBottom"
      (!isBottom && hover
        ? yOffset * 2
        : hover
        ? // This fills the remaining bottom space when hovering
          // Note that because yOffset is < 1, isBottom checks for HH:30
          // (min(end) || 60) to check for HH:00, otherwise this will return 60 - 0 = 60, correct return should be 0
          yOffset + (60 - (min(end) || 60)) * minuteHeight
        : 0),

    [minuteHeight, periodMin, isBottom, hover, yOffset, end],
  );
  const marginTop = useMemo(
    () => minuteHeight * minPrefix + (hover ? -yOffset : 0),
    [hover, minPrefix, minuteHeight, yOffset],
  );

  // Control horizontal hover offset, and handle indent
  const xOffset = useMemo(
    () => (matchDesktop ? "-15%" : "-30%"),
    [matchDesktop],
  );
  // If period touches right
  const isRight = useMemo(
    () => (showWeekend ? weekday === 6 : weekday === 4),
    [showWeekend, weekday],
  );
  const marginLeft = useMemo(
    () =>
      hover
        ? xOffset
        : indent
        ? /* indent.totalLevels < 3
          ? // Make the first ident level thinner, more visually balanced
            `${indent.indentLevel * 40}%`
          : */ `${indent.indentLevel * (100 / indent.totalLevels)}%`
        : 0,
    [hover, indent, xOffset],
  );
  const marginRight = useMemo(
    () => (!isRight && hover ? xOffset : 0),
    [hover, isRight, xOffset],
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

      // Delay hover exit for better viewing on mobile devices
      // prevHover is used becuase hover is always false when animation is in idle state, so cannot just use hover.
      delay: matchTouch && prevHover ? 1.5 : 0,
    }),
    [matchTouch, prevHover],
  );

  // Check minuteHeight for preventing initial height animation
  return minuteHeight && !periodOverflow ? (
    <motion.div
      // BUG: iOS will trigger onClick when leaving hover
      onClick={() => {
        onClick && onClick();
        // To prevent hover persist when details modal is shown
        onHoverEnd();
      }}
      style={{
        border: `1px solid ${borderColor(color)}`,
        // + 1 because grid is 1-indexed
        // + 1 because first row is weekday
        gridColumnStart: weekday + 2,
        gridRowStart,
        gridRowEnd,
      }}
      className="cursor-pointer select-none overflow-hidden"
      initial={false}
      onHoverEnd={onHoverEnd}
      onHoverStart={onHoverStart}
      animate={hover ? "hover" : "idle"}
      variants={{
        hover: {
          height,
          marginTop,
          marginLeft,
          marginRight,
          zIndex: 10,
          backgroundColor: color + "f8",
          transition: hoverTransition,
        },
        idle: {
          height,
          marginTop,
          marginLeft,
          marginRight,
          zIndex: 0,
          backgroundColor: color + "e8",
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
        {/* {indent?.indentLevel} {indent?.totalLevels} */}
        {/* {hover.toString()} <br /> */}
        {/* {prevHover?.toString()} */}
      </HoverContext.Provider>
    </motion.div>
  ) : null;
};

export default Period;
