import { motion } from "framer-motion";
import { useContext, useRef, useState } from "react";
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

// const HOVER_MARGIN = 12;

const GridPeriod = ({
  weekday,
  color,
  begin,
  end,
  marginLeft,
  children,
  onClick,
}: Props) => {
  const { showWeekend, displayedHours, minPerRow, minuteHeight } =
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

  // hover effect
  const matchTouch = useMediaQuery("(pointer: fine)");
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  const HOVER_MARGIN = (minPerRow * minuteHeight) / (matchDesktop ? 1.5 : 1.25);

  const [hover, setHover] = useState(false);

  const onHoverStart = () => setHover(true);
  const onHoverEnd = () => setHover(false);

  return minuteHeight && !(!showWeekend && weekday > 4) ? (
    <motion.div
      // whileHover="hover"
      variants={{
        hover: {
          zIndex: 10,
          marginLeft: matchDesktop ? "-17.5%" : "-40%",
          marginRight: !isRight() ? (matchDesktop ? "-17.5%" : "-40%") : 0,
          height:
            minuteHeight * periodMin + (!isBottom() ? HOVER_MARGIN * 2 : 0),
          backgroundColor: color + "ee",
          marginTop: -HOVER_MARGIN + minuteHeight * minPrefix,
          transition: {
            type: "spring",
            duration: 0.3,
            bounce: 0,
            delay: 0.3,
          },
        },
        idle: {
          zIndex: 0,
          marginLeft: 0,
          marginRight: 0,
          height: minuteHeight * periodMin,
          backgroundColor: color + "cc",
          marginTop: minuteHeight * minPrefix,
          transition: {
            type: "spring",
            duration: 0.3,
            bounce: 0,
            // Delay hover exit for better viewing on mobile devices
            delay: matchTouch ? 0 : 2,
          },
        },
      }}
      initial={false}
      animate={hover ? "hover" : "idle"}
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
      {children}
    </motion.div>
  ) : null;

  // return !(!showWeekend && weekday > 4) ? (
  //   <motion.div
  //     whileHover={{}}
  //     animate={{ marginTop: hover && !isBottom() ? -HOVER_MARGIN : 0 }}
  //     transition={{ type: "spring", duration: 0.2, bounce: 0 }}
  //     className="select-none"
  //     style={{
  //       gridColumnStart,
  //       gridRowStart,
  //       gridRowEnd,
  //     }}
  //   >
  //     <motion.div
  //       onHoverStart={toggleHover}
  //       onHoverEnd={toggleHover}
  //       whileHover={{
  //         marginLeft: "-17.5%",
  //         marginRight: "-17.5%",
  //         height:
  //           minuteHeight * periodMin + (!isBottom() ? HOVER_MARGIN * 2 : 0),
  //         zIndex: 10,
  //         backgroundColor: color + "ee",
  //       }}
  //       transition={{ type: "spring", duration: 0.2, bounce: 0 }}
  //       className="relative cursor-pointer overflow-hidden"
  //       style={{
  //         marginTop: minuteHeight * minPrefix,
  //         height: minuteHeight * periodMin,
  //         backgroundColor: color + "cc",
  //       }}
  //       onClick={onClick}
  //     >
  //       {children}
  //     </motion.div>
  //   </motion.div>
  // ) : null;
};

export default GridPeriod;
