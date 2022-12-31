import clsx from "clsx";
import { useContext } from "react";
import { WeekViewContext } from "./Context";

const Border = () => {
  const { rows, cols } = useContext(WeekViewContext);

  return (
    <>
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          style={{
            gridRowStart: Math.floor(i / cols) + 2,
            gridColumnStart: (i % cols) + 2,
          }}
          className={clsx(
            "border-[0.5px] border-gray-300",
            i % cols === 0 && "border-l-0",
            (i + 1) % cols === 0 && "border-r-0",
            i > cols * rows - cols - 1 && "border-b-0",
            Math.floor(i / cols) % 2
              ? "border-t-gray-300/50"
              : "border-b-gray-300/50",
            (i % cols === 5 || i % cols === 6) && "bg-gray-200/40",
          )}
        />
      ))}
    </>
  );
};

export default Border;
