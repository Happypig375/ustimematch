import clsx from "clsx";
import React from "react";
import Spinner from "./Spinner";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: boolean;
  plain?: boolean;
  error?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button component
 * @param   {boolean} plain     Remove border and background
 * @param   {boolean} loading   Whether button is loading (should be used with disabled)
 */
const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    { icon, plain, error, loading, fullWidth, className, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      {...props}
      className={clsx(
        "flex h-10 select-none items-center justify-center gap-2 rounded-md transition-all",
        "enabled:hover:border-border-200 enabled:hover:text-fg-200",
        "active:bg-bg-300 active:text-fg-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        icon ? "w-10 flex-shrink-0" : "px-4",
        plain
          ? "h-auto w-auto border-none bg-transparent p-[2px] opacity-80 enabled:hover:opacity-100"
          : "border border-border-100 bg-bg-200 text-fg-100",
        error &&
          "text-red-500 focus-visible:ring-red-200/80 focus-visible:ring-offset-red-400 active:text-red-600 enabled:hover:text-red-600 dark:focus-visible:ring-red-400/20 dark:focus-visible:ring-offset-red-600",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;
