import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  color: string;
}

const ColorChip = ({ color, className }: Props) => {
  return (
    <div
      style={{ backgroundColor: color }}
      // flex-shrink-0 to prevent truncated text squashing the color chip
      className={clsx(
        "h-5 w-5 flex-shrink-0 rounded-md shadow-outline",
        className,
      )}
    />
  );
};

export default ColorChip;
