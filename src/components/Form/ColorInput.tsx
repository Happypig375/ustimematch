import * as Label from "@radix-ui/react-label";
import clsx from "clsx";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useController, type UseControllerProps } from "react-hook-form";
import { textColor } from "@utils/color";
import { ZBaseTimetable } from "../../types/timetable";
import { type ITimetableForm } from "./TimetableForm";

interface ColorPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}

const ColorPreview = ({ color, className }: ColorPreviewProps) => {
  return (
    <div
      style={{
        backgroundColor: color + "d8",
      }}
      className={clsx(
        "flex h-[10vh] flex-col gap-1 overflow-hidden rounded-md p-2 leading-none shadow-outline",
        className,
      )}
    >
      <div
        style={{ color: textColor(color) + "ee" }}
        className="flex flex-wrap justify-between gap-x-1 gap-y-0 text-[clamp(0.725rem,1.4vw,0.875rem)] font-medium"
      >
        <div>Preview</div>
        <div>L1</div>
      </div>

      <div
        style={{ color: textColor(color) + "cc" }}
        className="text-[clamp(0.65rem,1.2vw,0.7rem)]"
      >
        9:00 am - 10:30 am
      </div>

      <div
        style={{ color: textColor(color) + "aa" }}
        className="text-[clamp(0.65rem,1.2vw,0.7rem)]"
      >
        Lecture Theater A (401)
      </div>
    </div>
  );
};

interface ColorInputProps extends UseControllerProps<ITimetableForm, "color"> {
  disabled?: boolean;
}

export const ColorInput = ({ disabled, ...props }: ColorInputProps) => {
  const { field } = useController(props);

  const onChange = (color: string) => {
    // check for 3-character hex and convert to 6-character hex
    if (color.length === 4) color = "#" + color.slice(1, 4).repeat(2);

    if (
      disabled ||
      !ZBaseTimetable.shape.config.pick({ color: true }).safeParse({ color })
        .success
    )
      return;

    field.onChange(color);
  };

  return (
    // The styles of color input should be in parity with normal input
    <div className="flex flex-col gap-[2px]">
      <div className="flex">
        <Label.Root htmlFor="color" className="text-sm font-medium">
          Color
        </Label.Root>
      </div>

      <div className="flex gap-[6px]">
        <div className="flex w-[40%] flex-col gap-[6px]">
          <HexColorInput
            prefixed
            id="color"
            color={field.value}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
              "h-10 overflow-auto rounded-md px-2 transition-focusable",
              "border border-border-100 bg-bg-200",
              "hover:border-border-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />

          <ColorPreview
            color={field.value}
            className={clsx(disabled && "opacity-50")}
          />
        </div>

        <HexColorPicker
          color={field.value}
          onChange={onChange}
          className={clsx(
            "!h-auto flex-grow",
            disabled && "pointer-events-none opacity-50",
          )}
        />
      </div>
    </div>
  );
};
