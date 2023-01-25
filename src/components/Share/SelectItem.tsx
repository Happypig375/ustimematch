import * as Checkbox from "@radix-ui/react-checkbox";
import { IconCheckbox, IconSquare, IconSquareOff } from "@tabler/icons-react";
import clsx from "clsx";
import ColorChip from "@components/Explorer/ColorChip";
import type { Timetable } from "../../types/timetable";
import type { FolderItem } from "../../types/tree";

interface SelectItemProps {
  id: string;
  folderItem?: FolderItem;
  timetable?: Timetable;
  depth?: number;
  duplicateWarning?: boolean;
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean) => void;
}

const indentationWidth = 24;

const SelectItem = ({
  id,
  folderItem,
  timetable,
  depth = 0,
  duplicateWarning,
  checked,
  onCheckedChange,
}: SelectItemProps) => {
  const name = folderItem ? folderItem.name : timetable ? timetable.name : "";

  return (
    <label
      htmlFor={id}
      style={{
        marginLeft: indentationWidth * depth,
      }}
      className={clsx(
        "flex h-10 flex-shrink-0 cursor-pointer select-none items-center gap-2 rounded-md px-4 text-fg-100 transition-colors",
        checked && checked !== "indeterminate"
          ? "bg-bg-300 text-fg-200"
          : "hover:bg-bg-300/50 active:bg-bg-300",
      )}
    >
      <div className="flex flex-grow items-center gap-2 overflow-hidden">
        {timetable && <ColorChip color={timetable.config.color} />}

        <span title={name} className="truncate">
          {name}
        </span>
      </div>

      {duplicateWarning && (
        <span className="whitespace-nowrap rounded-sm bg-amber-500/50 px-2 py-[2px] text-xs">
          Duplicated
        </span>
      )}

      <Checkbox.Root
        checked={checked}
        id={id}
        onCheckedChange={onCheckedChange}
        className="pointer-events-none"
      >
        <Checkbox.Indicator>
          {checked === "indeterminate" ? (
            <IconSquareOff strokeWidth={1.75} className="h-5 w-5" />
          ) : (
            checked && <IconCheckbox strokeWidth={1.75} className="h-5 w-5" />
          )}
        </Checkbox.Indicator>

        {!checked && <IconSquare strokeWidth={1.75} className="h-5 w-5" />}
      </Checkbox.Root>
    </label>
  );
};

export default SelectItem;
