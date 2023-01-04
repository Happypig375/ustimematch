import clsx from "clsx";
import { useTrackedStore } from "@store/index";

const Border = () => {
  const rows = useTrackedStore().ui.weekViewRows();
  const cols = useTrackedStore().ui.weekViewCols();

  // Pixel perfect and relatively fast (no. of divs = rows + cols)
  return (
    <>
      {/* Horizontal lines */}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{
            // + 1 for 1-index grid
            // + 1 for first row weekdays
            gridRowStart: i + 2,
            gridColumnStart: 2,
            gridColumnEnd: -1,
          }}
          className={clsx(
            // Translate to ensure lines are in middle of two rows, with 0.5px on each side.
            "-translate-y-[0.5px] border-t border-t-border-gray-200",
            i % 2 === 1 && "border-t-border-gray-200/40",
          )}
        />
      ))}

      {/* Vertical lines */}
      {Array.from(
        { length: cols },
        (_, i) =>
          i !== 0 && (
            <div
              key={i}
              style={{
                gridRowStart: 2,
                gridRowEnd: -1,
                // + 1 for 1-index grid
                // + 1 for first column times
                gridColumnStart: i + 2,
              }}
              className={clsx(
                // Translate to ensure lines are in the middle of two columns, with 0.5px on each side.
                "-translate-x-[0.5px] border-l border-l-border-gray-200",
                // Darken weekends
                (i === 5 || i === 6) && "bg-zinc-200/40",
              )}
            />
          ),
      )}
    </>
  );
};

export default Border;
