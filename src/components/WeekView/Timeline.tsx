import clsx from "clsx";
import { useTrackedStore } from "@store/index";
import { DISPLAYED_HOURS } from "@store/ui";
import useDate from "@hooks/useDate";

const Timeline = () => {
  const { date } = useDate();

  const showWeekend = useTrackedStore().ui.showWeekend();
  const minuteHeight = useTrackedStore().weekView.minuteHeight();

  const weekday = (date.getDay() + 6) % 7;

  // 1-indexed grid + 1 col time
  const gridColumnStart = weekday + 2;

  const minSinceBegin =
    (date.getHours() - (DISPLAYED_HOURS[0] as number)) * 60 + date.getMinutes();

  const overflow =
    (DISPLAYED_HOURS[0] as number) > date.getHours() ||
    (DISPLAYED_HOURS[DISPLAYED_HOURS.length - 1] as number) < date.getHours() ||
    (!showWeekend && weekday > 4);

  // check minuteHeight for preventing initial flash
  return !overflow && minuteHeight ? (
    <div
      className="pointer-events-none relative -ml-[4px] overflow-y-hidden"
      style={{
        gridColumnStart,
        gridRow: "2 / -1",
      }}
    >
      <div
        style={{ top: minSinceBegin * minuteHeight }}
        className={clsx(
          // Line
          "relative h-[2px] w-full -translate-y-1/2 rounded-full bg-brand dark:bg-[#cc3232]",
          // Dot, vertical align: (8 - 2) / 2 = 3
          "before:absolute before:h-[8px] before:w-[8px] before:-translate-y-[3px] before:rounded-full before:border-[0.8px] before:border-bg-200 before:bg-brand before:dark:bg-[#cc3232]",
        )}
      />
    </div>
  ) : null;
};

export default Timeline;
