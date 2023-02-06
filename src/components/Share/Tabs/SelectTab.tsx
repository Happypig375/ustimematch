import { IconArrowForward, IconListCheck, IconX } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import Select from "@components/Select";
import Button from "@components/ui/Button";
import { ModalClose, ModalControl, ModalTitle } from "@components/ui/Modal";
import Tips from "@components/ui/Tips";
import { useTrackedStore } from "@store/index";
import type { Timetable } from "../../../types/timetable";

interface Props {
  checkedIds: string[];
  setCheckedIds: Dispatch<SetStateAction<string[]>>;
  onContinue(timetables: Timetable[]): void;
}

const SelectTab = ({ checkedIds, setCheckedIds, onContinue }: Props) => {
  const personalTimetable = useTrackedStore().timetable.personalTimetable();
  const timetablesTree = useTrackedStore().timetable.timetablesTree();
  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

  const empty = combinedTimetables.length === 0;
  const checkedAll = checkedIds.length === combinedTimetables.length;

  const toggleCheckAll = () => {
    if (checkedAll) setCheckedIds([]);
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <ModalTitle>Share</ModalTitle>

        <div className="flex gap-2">
          <span className="text-sm">
            {checkedIds.length} / {combinedTimetables.length} Selected
          </span>
          <Tips>
            Receivers will only be able to see timetables but not folders.
          </Tips>
        </div>
      </div>

      {empty ? (
        <span className="grid h-16 place-items-center text-sm">
          No timetables have been added.
        </span>
      ) : (
        <Select
          checkedIds={checkedIds}
          onCheckedIdsChange={setCheckedIds}
          timetableStore={{ personalTimetable, timetablesTree }}
        />
      )}

      <ModalControl>
        <Button
          icon
          disabled={empty}
          onClick={toggleCheckAll}
          title={checkedAll ? "Unselect All" : "Select All"}
        >
          <IconListCheck strokeWidth={1.75} className="h-5 w-5" />
        </Button>

        <ModalClose asChild>
          <Button fullWidth>
            <IconX strokeWidth={1.75} className="h-5 w-5" />
            Close
          </Button>
        </ModalClose>

        <Button
          fullWidth
          onClick={onContinueClick}
          disabled={checkedIds.length === 0}
        >
          <IconArrowForward strokeWidth={1.75} className="h-5 w-5" />
          Continue
        </Button>
      </ModalControl>
    </div>
  );
};

export default SelectTab;
