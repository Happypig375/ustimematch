import * as Label from "@radix-ui/react-label";
import clsx from "clsx";
import {
  forwardRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  labelId: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, labelId, disabled, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <Label.Root
          htmlFor={labelId}
          className="flex items-center justify-between text-sm font-medium"
        >
          {label}
          <span className="text-xs font-normal text-red-600">{error}</span>
        </Label.Root>

        <input
          id={labelId}
          ref={ref}
          disabled={disabled}
          className={clsx(
            "h-10 rounded-md border border-border-gray-100 bg-bg-light-100 px-2 transition-all hover:border-border-gray-200",
            "disabled:cursor-not-allowed disabled:bg-bg-light-300 disabled:opacity-50",
            error && "focus:ring-red-200/80 focus:ring-offset-red-400",
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
