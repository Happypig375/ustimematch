import * as Separator from "@radix-ui/react-separator";
import { IconArrowForward, IconListCheck, IconX } from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import { forwardRef } from "react";
import { useMemo } from "react";
import Button from "@components/ui/Button";
import { ModalClose, ModalControl, ModalTitle } from "@components/ui/Modal";
import Tips from "@components/ui/Tips";
import { useTrackedStore } from "@store/index";
import { flattenTree, getFlattenedTimetables } from "@utils/sortableTree";
import type { Timetable } from "../../types/timetable";
import SelectItem from "./SelectItem";

interface Props {
  checkedIds: string[];
  setCheckedIds: Dispatch<SetStateAction<string[]>>;
  onContinue: (timetables: Timetable[]) => void;
}

const SelectTab = forwardRef<HTMLDivElement, Props>(
  ({ checkedIds, setCheckedIds, onContinue }, ref) => {
    const personalTimetable = useTrackedStore().timetable.personalTimetable();
    const timetablesTree = useTrackedStore().timetable.timetablesTree();
    const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

    const flattenedTree = useMemo(
      () =>
        flattenTree(timetablesTree).filter(
          (item) =>
            !(
              item.treeItem.type === "FOLDER" &&
              item.treeItem.children.length === 0
            ),
        ),
      [timetablesTree],
    );

    const onCheckedChange = (id: string, checked: boolean) => {
      const item = flattenedTree.find((item) => item.treeItem.id === id);

      if (!item) return;

      if (item.treeItem.type === "FOLDER") {
        const timetableIds = getFlattenedTimetables(item.treeItem.children).map(
          (timetable) => timetable.config.id,
        );

        if (checked) setCheckedIds((prev) => [...prev, ...timetableIds]);
        else
          setCheckedIds((prev) =>
            prev.filter((id) => !timetableIds.includes(id)),
          );
      }

      if (item.treeItem.type === "TIMETABLE") {
        const id = item.treeItem.timetable.config.id;
        if (checked) setCheckedIds((prev) => [...prev, id]);
        else setCheckedIds((prev) => prev.filter((i) => i !== id));
      }
    };

    const folderChecked = (treeItemId: string): boolean | "indeterminate" => {
      const item = flattenedTree.find(
        (item) => item.treeItem.id === treeItemId,
      );

      if (
        !item ||
        item.treeItem.type !== "FOLDER" ||
        item.treeItem.children.length === 0
      )
        return false;

      const timetableIds = getFlattenedTimetables(item.treeItem.children).map(
        (timetable) => timetable.config.id,
      );

      const checkedTimetablesLength = timetableIds.filter((timetableId) =>
        checkedIds.includes(timetableId),
      ).length;

      return checkedTimetablesLength === timetableIds.length
        ? true
        : checkedTimetablesLength > 0
        ? "indeterminate"
        : false;
    };

    const timetableChecked = (timetableId: string): boolean =>
      checkedIds.includes(timetableId);

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

    const empty = flattenedTree.length === 0 && !personalTimetable;

    return (
      <div className="flex flex-col justify-center gap-4" ref={ref}>
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
          <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
            {/* Personal timetable */}
            {personalTimetable && (
              <>
                <SelectItem
                  id={personalTimetable.config.id}
                  timetable={personalTimetable}
                  checked={timetableChecked(personalTimetable.config.id)}
                  onCheckedChange={(checked) =>
                    setCheckedIds((prev) =>
                      checked
                        ? [...prev, personalTimetable.config.id]
                        : prev.filter(
                            (id) => id !== personalTimetable.config.id,
                          ),
                    )
                  }
                />

                <Separator.Root
                  decorative
                  orientation="horizontal"
                  className="h-[1px] w-full bg-border-100"
                />
              </>
            )}

            {/* Timetables tree */}
            {flattenedTree.map(({ depth, treeItem }) => (
              <SelectItem
                key={treeItem.id}
                depth={depth}
                id={treeItem.id}
                timetable={
                  treeItem.type === "TIMETABLE" ? treeItem.timetable : undefined
                }
                folderItem={treeItem.type === "FOLDER" ? treeItem : undefined}
                checked={
                  treeItem.type === "FOLDER"
                    ? folderChecked(treeItem.id)
                    : timetableChecked(treeItem.timetable.config.id)
                }
                onCheckedChange={(chekced) =>
                  onCheckedChange(treeItem.id, chekced)
                }
              />
            ))}
          </div>
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
  },
);
SelectTab.displayName = "SelectTab";

export default SelectTab;
