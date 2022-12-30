import { useContext } from "react";
import { useDate } from "@hooks/useCurrentTime";
import { WeekViewContext } from "./Context";

type Props = {
  minuteHeight: number;
};

const Timeline = ({ minuteHeight }: Props) => {
  const { date } = useDate();

  const { showWeekend, displayedHours } = useContext(WeekViewContext);

  const weekday = (date.getDay() + 6) % 7;

  // 1-indexed grid + 1 col time
  const gridColumnStart = weekday + 2;

  const minSinceBegin =
    (date.getHours() - (displayedHours[0] as number)) * 60 + date.getMinutes();

  const overflow =
    (displayedHours[0] as number) > date.getHours() ||
    (displayedHours[displayedHours.length - 1] as number) < date.getHours() ||
    (!showWeekend && weekday > 4);

  return (
    <>
      {!overflow && (
        <div
          className={`${
            // prevent initial flash
            minuteHeight ? "visible" : "hidden"
          } pointer-events-none relative z-[5] -ml-[3px] overflow-y-hidden md:-ml-[4px]`}
          style={{
            gridColumnStart,
            gridRow: "2/-1",
          }}
        >
          <div
            style={{ top: minSinceBegin * minuteHeight }}
            className="bg-brand absolute -mt-[1.25px] h-[2.5px] w-full rounded-full md:-mt-[1.5px] md:h-[3px]"
          />

          <div
            style={{ top: minSinceBegin * minuteHeight }}
            className="bg-brand absolute -mt-[3px] h-[6px] w-[6px] rounded-full md:-mt-[4px] md:h-[8px] md:w-[8px]"
          />
        </div>
      )}
    </>
  );
};

export default Timeline;
