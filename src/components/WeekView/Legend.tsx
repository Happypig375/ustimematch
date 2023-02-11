import clsx from "clsx";
import useResizeObserver from "use-resize-observer";
import { actions, useTrackedStore } from "@store/index";
import { MINUTE_PER_ROW, DISPLAYED_HOURS } from "@store/ui";
import { WEEKVIEW_ROWS } from "@store/ui";
import { rowToTime12 } from "@utils/time";

const Legend = () => {
  const weekdays = useTrackedStore().ui.weekdays();
  const setMinuteHeight = actions.weekView.setMinuteHeight;

  // Resize oberver for calculating height of a minute based on height of second row (first row is weekdays)
  const { ref: timeRef } = useResizeObserver<HTMLDivElement>({
    round: (n) => n,
    onResize: ({ width: _, height }) => {
      height && setMinuteHeight(height / MINUTE_PER_ROW);
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
        { length: WEEKVIEW_ROWS },
        (_, i) =>
          i % 2 === 0 && (
            <div
              key={i}
              ref={i === 0 ? timeRef : undefined}
              style={{ gridRowStart: i + 2, gridColumnStart: 1 }}
            >
              <div className="-translate-y-1/2 select-none pr-[6px] pl-[6px] text-right text-xs tracking-tight text-fg-100">
                {rowToTime12(DISPLAYED_HOURS, i)}
              </div>
            </div>
          ),
      )}
    </>
  );
};

export default Legend;
