import * as Label from "@radix-ui/react-label";
import clsx from "clsx";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useController, type UseControllerProps } from "react-hook-form";
import { borderColor, textColor } from "@utils/shade";
import { type PersonalTimetableForm } from "./PersonalTimetableModal";

interface ColorInputProps
  extends UseControllerProps<PersonalTimetableForm, "color"> {
  disabled: boolean;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}

const ColorPreview = ({ color, className }: Props) => {
  return (
    <div
      className={clsx("overflow-hidden rounded-md", className)}
      style={{
        backgroundColor: color + "cc",
        border: `1px solid ${borderColor(color)}`,
      }}
    >
      <div
        style={{ color: textColor(color) }}
        className="flex flex-col gap-[0.1rem] p-2 text-sm font-semibold"
      >
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-[0.1rem]">
          <p>PREVIEW</p>
          <p>L0</p>
        </div>
        <p className="text-xs font-light">12:00 am - 11:59 pm</p>
      </div>
    </div>
  );
};

export const ColorInput = ({ disabled, ...props }: ColorInputProps) => {
  const { field } = useController(props);

  const onChange = (newColor: string) => !disabled && field.onChange(newColor);

  return (
    // The styles of color input should be in parity with normal input.
    // These two styles are not linked right now, manually copying is required.
    <div className="flex flex-col gap-1">
      <Label.Root htmlFor="color" className="text-sm font-medium">
        Color
      </Label.Root>

      <div className="flex h-36 gap-[6px]">
        <div className="flex w-2/5 flex-col gap-[6px]">
          <HexColorInput
            prefixed
            id="color"
            color={field.value}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
              "flex-shrink-0",
              "h-10 rounded-md border border-border-gray-100 px-2 transition-all hover:border-border-gray-200 disabled:cursor-not-allowed disabled:bg-bg-light-300 disabled:text-gray-500",
            )}
          />

          <ColorPreview className="h-full" color={field.value} />
        </div>

        {/* Known issue: pointer device mouse up outside modal will cause modal to close */}
        <HexColorPicker
          color={field.value}
          onChange={onChange}
          className={clsx(
            "!h-full flex-grow",
            disabled && "pointer-events-none",
          )}
        />
      </div>
    </div>
  );
};
