import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from "clsx";

const IconButton = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-md border border-gray-200 p-2 hover:border-gray-300 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-blue-400",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default IconButton;
