import clsx from "clsx";
import React from "react";
import Spinner from "./Spinner";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  matchIconPadding?: boolean;
}

/**
 * Button component
 * @param   {boolean} icon
 * @param   {boolean} loading   Whether button is loading (should be used in with disabled)
 * @param   {boolean} disabled
 * @param   {boolean} fullWidth
 * @param   {boolean} fullHeight
 * @param   {boolean} matchIconPadding
 */
const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
      icon = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      fullHeight = false,
      matchIconPadding = false,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md border border-border-gray-100 bg-bg-light-100 text-text-black-100 transition-all active:bg-bg-light-200 enabled:hover:border-border-gray-200 enabled:hover:text-text-black-200 disabled:cursor-not-allowed disabled:bg-bg-light-400",
        fullWidth && "w-full",
        fullHeight && "h-full",
        icon ? "p-2" : matchIconPadding ? "px-4 py-2" : "py-1 px-4",
        className,
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;
