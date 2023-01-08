import * as Label from "@radix-ui/react-label";
import clsx from "clsx";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useController, type UseControllerProps } from "react-hook-form";
import { borderColor, textColor } from "@utils/color";
import { type PersonalTimetableForm } from "./TimetableForm";

interface ColorInputProps
  extends UseControllerProps<PersonalTimetableForm, "color"> {
  disabled?: boolean;
}

interface ColorPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}

const ColorPreview = ({ color, className }: ColorPreviewProps) => {
  return (
    <div
      style={{
        backgroundColor: color + "d8",
        border: `1px solid ${borderColor(color)}`,
      }}
      className={clsx(
        "flex flex-col gap-2 rounded-md p-2 leading-none",
        className,
      )}
    >
      <div
        style={{ color: textColor(color) }}
        className="flex flex-wrap justify-between gap-x-2 gap-y-1 text-[clamp(0.8rem,1.8vw,0.9rem)] font-medium"
      >
        <div>Preview</div>
        <div>L0</div>
      </div>

      <div
        style={{ color: textColor(color) + "cc" }}
        className="text-[clamp(0.7rem,1.7vw,0.8rem)]"
      >
        12:00 am - 11:59 pm
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
              "h-10 rounded-md border border-border-gray-100 px-2 transition-all hover:border-border-gray-200",
              "disabled:cursor-not-allowed disabled:bg-bg-light-300 disabled:opacity-50",
            )}
          />

          <ColorPreview
            className={clsx("h-full", disabled && "opacity-50")}
            color={field.value}
          />
        </div>

        <HexColorPicker
          color={field.value}
          onChange={onChange}
          className={clsx(
            "!h-full flex-grow",
            disabled && "pointer-events-none opacity-50",
          )}
        />
      </div>
    </div>
  );
};
