import * as Checkbox from "@radix-ui/react-checkbox";
import { IconCheckbox, IconEye, IconEyeOff, IconSquare } from "@tabler/icons";
import { AnimatePresence, motion, Variants } from "framer-motion";
import ColorChip from "@components/Explorer/ColorChip";
import type { Timetable } from "../../types/timetable";

interface Props {
  timetable: Timetable;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TimetableItem = ({ timetable, checked, onCheckedChange }: Props) => {
  return (
    <div className="flex select-none items-center gap-2 rounded-md px-4 py-2 transition-all hover:shadow-tree-item active:opacity-80">
      <label
        htmlFor={timetable.config.id}
        className="flex flex-grow cursor-pointer items-center gap-2 overflow-hidden"
      >
        <ColorChip color={timetable.config.color} />

        <span title={timetable.name} className="truncate">
          {timetable.name}
        </span>
      </label>

      <Checkbox.Root
        checked={checked}
        id={timetable.config.id}
        onCheckedChange={onCheckedChange}
      >
        <Checkbox.Indicator>
          <IconCheckbox stroke={1.75} className="h-5 w-5 text-text-black-200" />
        </Checkbox.Indicator>

        {!checked && (
          <IconSquare stroke={1.75} className="h-5 w-5 text-text-black-100" />
        )}
      </Checkbox.Root>
    </div>
  );
};

export default TimetableItem;
