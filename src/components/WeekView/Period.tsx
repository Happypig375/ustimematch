import { motion, type Transition } from "framer-motion";
import debounce from "lodash.debounce";
import { createContext, useEffect, useMemo, useState } from "react";
import { useTrackedStore } from "@store/index";
import useMediaQuery from "@hooks/useMediaQuery";
import { hour, min } from "@utils/time";

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
  const showWeekend = useTrackedStore().ui.showWeekend();
  const displayedHours = useTrackedStore().ui.displayedHours();
  const minutePerRow = useTrackedStore().ui.minutePerRow();
  const minuteHeight = useTrackedStore().weekView.minuteHeight();

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
            (Math.floor(min(begin) / minutePerRow) ? minutePerRow : 0)) /
            minutePerRow +
          2
        : 2,
    [begin, displayedHours, minutePerRow],
  );
  const gridRowEnd = useMemo(
    () =>
      hour(end) <= (displayedHours[displayedHours.length - 1] as number)
        ? ((hour(end) - (displayedHours[0] as number)) * 60 +
            (Math.ceil(min(end) / minutePerRow)
              ? Math.ceil(min(end) / minutePerRow) * minutePerRow
              : 0)) /
            minutePerRow +
          2
        : displayedHours.length * 2 + 2,
    [displayedHours, end, minutePerRow],
  );

  // Length of period in minutes
  const periodMin = useMemo(
    () => (hour(end) - hour(begin)) * 60 + min(end) - min(begin),
    [begin, end],
  );

  // Calculate grid offset (how many mins from the beginning of hour)
  const minPrefix = useMemo(
    () => (min(begin) >= minutePerRow ? min(begin) - minutePerRow : min(begin)),
    [begin, minutePerRow],
  );

  // Hover state used for transition
  const [hover, setHover] = useState(false);
  const onHoverStart = () => setHover(true);
  const onHoverEnd = () => setHover(false);

  // Previous hover state for determining if user is hovering
  const [prevHover, setPrevHover] = useState(hover);
  const debounceSetPrevHover = useMemo(
    // This delay is how long before it is considered hovering
    // Here uses 300ms to match hover transition delay
    () => debounce((v: boolean) => setPrevHover(v), 300),
    [],
  );
  useEffect(() => {
    debounceSetPrevHover(hover);
  }, [hover, debounceSetPrevHover]);

  // Matching touch screen devices
  const matchTouch = useMediaQuery("(pointer: coarse)");
  // Matching tailwind's sm: breakpoint
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  // Controls vertical hover offset, and constrain it by grid border (right and bottom)
  const isBottom = useMemo(
    () => end > `${displayedHours[displayedHours.length - 1]}:30`,
    [displayedHours, end],
  );
  const yOffset = useMemo(
    () => minutePerRow * minuteHeight * (matchDesktop ? 0.8 : 0.9),
    [matchDesktop, minutePerRow, minuteHeight],
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
        ? indent.totalLevels < 3
          ? // Make the first ident level more visually balanced
            `${indent.indentLevel * 40}%`
          : `${indent.indentLevel * (100 / indent.totalLevels)}%`
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
      // Delay hover exit for better viewing on mobile devices.
      // prevHover is used to restrict delay to only when hovering. (prevent unnecessary delay)
      // Cannot use hover beucase it is always false when animation is in idle state.
      delay: matchTouch && prevHover ? 1.5 : 0,
    }),
    [matchTouch, prevHover],
  );

  // Check minuteHeight to prevent initial height animation (default is 0 as defined in weekView store)
  return minuteHeight && !periodOverflow ? (
    <motion.div
      onClick={() => {
        // BUG: Touch devices will trigger onClick onHoverEnd (iOS's tolerance is longer, Android's shorter)
        // What we want is only trigger onClick when user is not hovering, otherwise continue with the hover transition.
        // prevHover here determines whether user is hovering
        onClick && !prevHover && onClick();

        // The above doesn't apply to desktop devices
        onClick && !matchTouch && onClick();

        // To prevent hover persist when details modal is shown
        onHoverEnd();
      }}
      style={{
        // + 1 because grid is 1-indexed
        // + 1 because first row is weekday
        gridColumnStart: weekday + 2,
        gridRowStart,
        gridRowEnd,
      }}
      className="cursor-pointer select-none overflow-hidden shadow-outline"
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
          backgroundColor: color + "d8",
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
