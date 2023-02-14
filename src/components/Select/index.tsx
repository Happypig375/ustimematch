import * as Separator from "@radix-ui/react-separator";
import { useMemo } from "react";
import SelectItem from "@components/Select/SelectItem";
import { useTrackedStore } from "@store/index";
import type { TimetableStore } from "@store/timetable";
import {
  flattenTreeNonEmpty,
  getFlattenedTimetables,
} from "@utils/sortableTree";

interface Props {
  disabled?: boolean;
  showDuplication?: boolean;
  timetableStore: TimetableStore;
  checkedIds: string[];
  onCheckedIdsChange(checkedIds: string[]): void;
}

/**
 * Provides a UI for selecting timetables, given checkedIds and a timetableStore.
 */
const Selector = ({
  disabled,
  showDuplication,
  timetableStore: { personalTimetable, timetablesTree },
  checkedIds,
  onCheckedIdsChange,
}: Props) => {
  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

  const flattenedTree = useMemo(
    () => flattenTreeNonEmpty(timetablesTree),
    [timetablesTree],
  );

  const onCheckedChange = (id: string, checked: boolean) => {
    const item = flattenedTree.find((item) => item.treeItem.id === id);

    if (!item) return;

    if (item.treeItem.type === "FOLDER") {
      const timetableIds = getFlattenedTimetables(item.treeItem.children).map(
        (timetable) => timetable.config.id,
      );

      if (checked) onCheckedIdsChange([...checkedIds, ...timetableIds]);
      else
        onCheckedIdsChange(
          checkedIds.filter((id) => !timetableIds.includes(id)),
        );
    }

    if (item.treeItem.type === "TIMETABLE") {
      const id = item.treeItem.timetable.config.id;
      if (checked) onCheckedIdsChange([...checkedIds, id]);
      else onCheckedIdsChange(checkedIds.filter((i) => i !== id));
    }
  };

  const folderChecked = (treeItemId: string): boolean | "indeterminate" => {
    const item = flattenedTree.find((item) => item.treeItem.id === treeItemId);

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

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
        {/* Personal timetable */}
        {personalTimetable && (
          <SelectItem
            disabled={disabled}
            duplicateWarning={
              showDuplication &&
              combinedTimetables.some(
                ({ name }) => name === personalTimetable.name,
              )
            }
            id={personalTimetable.config.id}
            timetable={personalTimetable}
            checked={timetableChecked(personalTimetable.config.id)}
            onCheckedChange={(checked) =>
              onCheckedIdsChange(
                checked
                  ? [...checkedIds, personalTimetable.config.id]
                  : checkedIds.filter(
                      (id) => id !== personalTimetable.config.id,
                    ),
              )
            }
            data-cy="share-select-item-0"
          />
        )}

        {personalTimetable && flattenedTree.length > 0 && (
          <Separator.Root
            decorative
            orientation="horizontal"
            className="h-[1px] w-full flex-shrink-0 bg-border-100"
          />
        )}

        {/* Timetables tree */}
        {flattenedTree.map(({ depth, treeItem }, i) => (
          <SelectItem
            disabled={disabled}
            duplicateWarning={
              showDuplication &&
              treeItem.type === "TIMETABLE" &&
              combinedTimetables.some(
                ({ name }) => name === treeItem.timetable.name,
              )
            }
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
            onCheckedChange={(chekced) => onCheckedChange(treeItem.id, chekced)}
            data-cy={`share-select-item-${i + (personalTimetable ? 1 : 0)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Selector;
