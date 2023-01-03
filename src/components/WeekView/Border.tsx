import clsx from "clsx";
import { useContext } from "react";
import { WeekViewContext } from "./Context";

const Border = () => {
  const { rows, cols } = useContext(WeekViewContext);

  // Middle ground of the below two methods (pixel perfect and much quicker than method 2)
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{
            gridRowStart: i + 2,
            gridColumnStart: 2,
            gridColumnEnd: -1,
          }}
          className={clsx(
            i % 2 === 0 &&
              "border-y border-t-border-gray-200 border-b-border-gray-200/40",
          )}
        />
      ))}

      {Array.from({ length: cols }, (_, i) => (
        <div
          key={i}
          style={{
            gridRowStart: 2,
            gridRowEnd: -1,
            gridColumnStart: i + 2,
          }}
          className={clsx(
            i !== 0 && "border-l border-l-border-gray-200",
            // Darken weekends
            (i === 5 || i === 6) && "bg-zinc-200/40",
          )}
        />
      ))}
    </>
  );

  // Method 1 : uses linear gradient to render the border, less sharp but so much faster
  // return (
  //   <>
  //     {/* Darken weekend */}
  //     {showWeekend && (
  //       <div
  //         style={{ gridArea: "2 / 7 / -1 / -1" }}
  //         className="bg-zinc-200/40"
  //       />
  //     )}

  //     {/* Don't know why this is slightly offseted */}
  //     <div
  //       style={{
  //         gridArea: "2 / 3 / -1 / -1",
  //         background: `
  //         repeating-linear-gradient(
  //           90deg,
  //           #d4d4d4f8,
  //           #d4d4d4f8 1px,
  //           transparent 1px,
  //           transparent ${columnWidth}px)`,
  //       }}
  //     />

  //     {/* Not quite pixel perfect horizontal lines */}
  //     <div
  //       style={{
  //         // 2 because first row is weekday, first col is time
  //         gridArea: "2 / 2 / -1 / -1",
  //         background: `
  //           repeating-linear-gradient(
  //             180deg,
  //             #d4d4d4f8,
  //             #d4d4d4f8 1px,
  //             transparent 1px,
  //             transparent ${minPerRow * minuteHeight * 2}px),
  //           repeating-linear-gradient(
  //             180deg,
  //             #d4d4d468,
  //             #d4d4d468 1px,
  //             transparent 1px,
  //             transparent ${minPerRow * minuteHeight}px)`,
  //       }}
  //     />
  //   </>
  // );

  // Method 2: Renders too much divs and is very slow
  // return (
  //   <>
  //     {Array.from({ length: rows * cols }, (_, i) => (
  //       <div
  //         key={i}
  //         style={{
  //           // + 1 because grid is 1-indexed
  //           // + 1 because first row is weekday
  //           gridRowStart: Math.floor(i / cols) + 2,
  //           // + 1 because grid is 1-indexed
  //           // + 1 because first column is time
  //           gridColumnStart: (i % cols) + 2,
  //         }}
  //         className={clsx(
  //           "border-[0.5px] border-border-gray-200",
  //           // Increase topmost border width
  //           i < cols && "border-t-[1px]",
  //           // Removes leftmost border
  //           i % cols === 0 && "border-l-0",
  //           // Removes bottom-most border
  //           i > cols * rows - cols - 1 && "border-b-0",
  //           // Removes rightmost border
  //           (i + 1) % cols === 0 && "border-r-0",
  //           // Composition of lighter border
  //           Math.floor(i / cols) % 2
  //             ? "border-t-border-gray-100"
  //             : "border-b-border-gray-100",
  //           // Darken weekends
  //           (i % cols === 5 || i % cols === 6) && "bg-zinc-200/40",
  //         )}
  //       />
  //     ))}
  //   </>
  // );
};

export default Border;
