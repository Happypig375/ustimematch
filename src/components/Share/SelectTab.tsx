import * as Checkbox from "@radix-ui/react-checkbox";
import {
  IconArrowForward,
  IconCheckbox,
  IconListCheck,
  IconSquare,
  IconX,
} from "@tabler/icons";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import ColorChip from "@components/Explorer/ColorChip";
import Button from "@ui/Button";
import { ModalClose, ModalControl } from "@ui/Modal";
import { useTrackedStore } from "@store/index";
import type { Timetable } from "../../types/timetable";

interface TimetableItemProps {
  timetable: Timetable;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TimetableItem = ({
  timetable,
  checked,
  onCheckedChange,
}: TimetableItemProps) => {
  return (
    <label
      htmlFor={timetable.config.id}
      className={clsx(
        "flex h-10 cursor-pointer select-none items-center gap-2 rounded-md px-4 transition-colors",
        "hover:bg-bg-200 active:bg-bg-200",
      )}
    >
      <div className="flex flex-grow items-center gap-2 overflow-hidden">
        <ColorChip color={timetable.config.color} />

        <span title={timetable.name} className="truncate">
          {timetable.name}
        </span>
      </div>

      <Checkbox.Root
        checked={checked}
        id={timetable.config.id}
        onCheckedChange={onCheckedChange}
        className="pointer-events-none"
      >
        <Checkbox.Indicator>
          <IconCheckbox stroke={1.75} className="h-5 w-5 text-fg-500" />
        </Checkbox.Indicator>

        {!checked && (
          <IconSquare stroke={1.75} className="h-5 w-5 text-fg-100" />
        )}
      </Checkbox.Root>
    </label>
  );
};

interface Props {
  checkedIds: string[];
  setCheckedIds: Dispatch<SetStateAction<string[]>>;
  onContinue: (timetables: Timetable[]) => void;
}

const SelectTab = ({ checkedIds, setCheckedIds, onContinue }: Props) => {
  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

  const onCheckedChange = (id: string, checked: boolean) => {
    if (checked) setCheckedIds([...checkedIds, id]);
    else setCheckedIds((prev) => prev.filter((i) => i !== id));
  };

  const checked = (id: string) => checkedIds.includes(id);

  const toggleCheck = () => {
    if (checkedIds.length === combinedTimetables.length) setCheckedIds([]);
    else setCheckedIds(combinedTimetables.map((t) => t.config.id));
  };

  const onContinueClick = () => {
    onContinue(
      combinedTimetables.filter((timetable) =>
        checkedIds.includes(timetable.config.id),
      ),
    );
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="max-h-[336px] overflow-y-auto">
        {combinedTimetables.map((timetable) => (
          <TimetableItem
            key={timetable.config.id}
            timetable={timetable}
            checked={checked(timetable.config.id)}
            onCheckedChange={(checked) =>
              onCheckedChange(timetable.config.id, checked)
            }
          />
        ))}
      </div>

      {combinedTimetables.length === 0 && (
        <span className="text-center text-sm">Add some timetables first!</span>
      )}

      <ModalControl>
        <Button icon onClick={toggleCheck}>
          <IconListCheck stroke={1.75} className="h-5 w-5" />
        </Button>

        <ModalClose asChild>
          <Button fullWidth>
            <IconX stroke={1.75} className="h-5 w-5" />
            Close
          </Button>
        </ModalClose>

        <Button fullWidth onClick={onContinueClick}>
          <IconArrowForward stroke={1.75} className="h-5 w-5" />
          Continue
        </Button>
      </ModalControl>
    </div>
  );
};

export default SelectTab;
