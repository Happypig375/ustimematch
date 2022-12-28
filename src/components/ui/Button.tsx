import clsx from "clsx";
import React from "react";
import Spinner from "./Spinner";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: boolean;
  toggle?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button component
 * @param   {boolean} icon
 * @param   {boolean} toggle    Control the style of toggle button
 * @param   {boolean} loading   Whether button is loading (should be used with disabled)
 * @param   {boolean} fullWidth
 */
const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
      icon = false,
      toggle = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      className={clsx(
        "flex h-10 items-center justify-center gap-2 rounded-md border border-border-gray-100 bg-bg-light-100 text-text-black-100 transition-all active:bg-bg-light-200 enabled:hover:border-border-gray-200 enabled:hover:text-text-black-200 disabled:cursor-not-allowed disabled:bg-bg-light-400",
        fullWidth && "w-full",
        icon ? "w-10 flex-shrink-0" : "px-4",
        toggle && "bg-bg-light-400 active:bg-bg-light-400",
        className,
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;
