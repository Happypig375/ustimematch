import clsx from "clsx";
import debounce from "lodash.debounce";
import { useCallback, useMemo } from "react";
import useResizeObserver from "use-resize-observer";
import { actions, useTrackedStore } from "@store/index";

const Legend = () => {
  const rows = useTrackedStore().ui.weekViewRows();
  const minutePerRow = useTrackedStore().ui.minutePerRow();
  const weekdays = useTrackedStore().ui.weekdays();
  const displayedHours = useTrackedStore().ui.displayedHours();
  const setMinuteHeight = actions.weekView.setMinuteHeight;

  // Convert row index to time in 12-hour format (e.g. 12 am, 12 pm, 9 am)
  const getTime = useCallback(
    (i: number) => {
      const h = displayedHours[(i - 1) / 2];
      if (h === undefined) return "";
      return `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;
    },
    [displayedHours],
  );

  // Resize oberver for calculating height of a minute based on height of second row (first row is weekdays)
  const setMinuteHeightDebounce = useMemo(
    () => debounce((height: number) => setMinuteHeight(height), 200),
    [setMinuteHeight],
  );

  const { ref: timeRef } = useResizeObserver<HTMLDivElement>({
    round: (n) => n,
    onResize: ({ width: _, height }) => {
      height && setMinuteHeightDebounce(height / minutePerRow);
    },
  });

  return (
    <>
      {/* First row weekday */}
      {weekdays.map((v, i) => (
        <div
          key={i}
          style={{ gridRowStart: 1, gridColumnStart: i + 2 }}
          className={clsx(
            "flex select-none items-center justify-center p-2 leading-none",
            new Date().getDay() === (i + 1) % 7
              ? "font-medium text-brand"
              : "text-fg-100",
          )}
        >
          {v}
        </div>
      ))}

      {Array.from(
        { length: rows },
        (_, i) =>
          i % 2 === 1 && (
            <div
              key={i}
              ref={i === 1 ? timeRef : undefined}
              style={{ gridRowStart: i + 1, gridColumnStart: 1 }}
            >
              <div className="-translate-y-1/2 select-none pr-[6px] pl-[6px] text-right text-xs tracking-tight text-fg-100">
                {getTime(i)}
              </div>
            </div>
          ),
      )}
    </>
  );
};

export default Legend;
