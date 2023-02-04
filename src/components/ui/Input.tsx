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
  error?: string;
  tips?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, label, error, className, tips, ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col gap-[2px]", className)}>
        {/* Only render label row if any of the below props exists */}
        {(label || error || tips) && (
          <div className="flex justify-between">
            {label && (
              <Label.Root htmlFor={id} className="text-sm font-medium">
                {label}
              </Label.Root>
            )}

            <div className="flex items-center gap-[2px]">
              <span
                className="text-xs text-red-500"
                data-cy={`input-error-${id}`}
              >
                {error}
              </span>

              {tips && <Tips>{tips}</Tips>}
            </div>
          </div>
        )}

        <input
          id={id}
          ref={ref}
          data-cy={`input-${id}`}
          className={clsx(
            "h-10 overflow-auto rounded-md px-2 transition-focusable",
            "border border-border-100 bg-bg-200",
            "hover:border-border-200 active:border-border-200",
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
