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
}

/**
 * Button component
 * @param   {boolean} icon
 * @param   {boolean} loading   Whether button is loading (should be used in with disabled)
 * @param   {boolean} disabled
 * @param   {boolean} fullWidth
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
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      className={clsx(
        "rounded-md border border-gray-200 bg-bg-light-100 text-gray-600 transition-all active:bg-bg-light-200 enabled:hover:border-gray-300 enabled:hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-bg-light-400",
        fullWidth && "flex w-full items-center justify-center",
        icon ? "p-2" : "py-1 px-4",
        className,
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;
