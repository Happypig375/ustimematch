import * as Label from "@radix-ui/react-label";
import clsx from "clsx";
import {
  forwardRef,
  type ReactNode,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import Tips from "./Tips";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  labelId?: string;
  error?: string;
  tips?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, labelId, disabled, error, className, tips, ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col gap-1", className)}>
        <div className="flex justify-between">
          {label && labelId && (
            <Label.Root
              htmlFor={labelId}
              className="flex items-center justify-between text-sm font-medium"
            >
              {label}
            </Label.Root>
          )}

          <div className="flex items-center gap-[6px]">
            <span
              className="text-xs font-normal text-red-600"
              data-cy={`input-error-${labelId}`}
            >
              {error}
            </span>
            {tips && <Tips>{tips}</Tips>}
          </div>
        </div>

        <input
          id={labelId}
          ref={ref}
          disabled={disabled}
          className={clsx(
            "h-10 overflow-auto rounded-md px-2 transition-all",
            "border border-border-100 bg-bg-200",
            "hover:border-border-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "focus:ring-red-200/80 focus:ring-offset-red-400 dark:focus:ring-red-400/20 dark:focus:ring-offset-red-600",
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
