import { useState, forwardRef, useEffect } from "react";
import {
  SimpleTreeItemWrapper,
  SortableTree,
  type TreeItemComponentProps,
  type TreeItems,
} from "dnd-kit-sortable-tree";
import {
  ArrowsUpDownIcon,
  Bars2Icon,
  Bars3Icon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import TreeTimetableItem from "@ui/TreeTimetableItem";
import { useStore } from "../../store";

type MinimalTreeItemData = {
  value: string;
};

const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
  {
    id: "Folder 1",
    value: "Folder 1",
    canHaveChildren: true,
    children: [
      {
        id: "Timetable 1",
        value: "Timetable 1",
        canHaveChildren: false,
      },
      {
        id: "Timetable 2",
        value: "Timetable 2",
        canHaveChildren: false,
      },
    ],
  },
  {
    id: "Timetable 3",
    value: "Timetable 3",
    canHaveChildren: false,
  },
  {
    id: "Folder 2",
    value: "Folder 2",
    canHaveChildren: true,
    children: [
      {
        id: "Timetabl 4",
        value: "Timetable 4",
        canHaveChildren: false,
      },
      {
        id: "Timetabl 5",
        value: "Timetable 5",
        canHaveChildren: false,
      },
      {
        id: "Timetabl 6",
        value: "Timetable 6",
        canHaveChildren: false,
      },
    ],
  },
  {
    id: "Timetable 7",
    value: "Timetable 7",
    canHaveChildren: false,
  },
  {
    id: "Timetable 8",
    value: "Timetable 8",
    canHaveChildren: false,
  },
  {
    id: "Timetable 9",
    value: "Timetable 9",
    canHaveChildren: false,
  },
  {
    id: "Timetable 10",
    value: "Timetable 10",
    canHaveChildren: false,
  },
  {
    id: "Timetable 11",
    value: "Timetable 12",
    canHaveChildren: false,
  },
  {
    id: "Timetable 13",
    value: "Timetable 13",
    canHaveChildren: false,
  },
  {
    id: "Timetable 14",
    value: "Timetable 14",
    canHaveChildren: false,
  },
];

const MinimalTreeItemComponent = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<MinimalTreeItemData>
>((props, ref) => {
  return (
    <TreeTimetableItem {...props} ref={ref} manualDrag showDragHandle={false}>
      <div className="flex items-center gap-2">
        <div>{props.item.value}</div>
      </div>
    </TreeTimetableItem>
  );
});
MinimalTreeItemComponent.displayName = "MinimalTreeItemComponent";

const TimetablesTree = () => {
  const [items, setItems] = useState(initialViableMinimalData);

  const explorerReorderMode = useStore.use.explorerReorderMode();

  return (
    <div className="h-full overflow-y-auto">
      <SortableTree
        disableSorting={!explorerReorderMode}
        // pointerSensorOptions={{ activationConstraint: {} }}
        items={items}
        onItemsChanged={(items) => {
          // for (let i = 0; i < items.length; i++) {
          //   if (
          //     !items[i].canHaveChildren ||
          //     typeof items[i].children === "undefined"
          //   )
          //     continue;
          //   for (let j = 0; j < items[i].children.length; j++) {
          //     if (items[i].children[j].canHaveChildren) return;
          //   }
          // }

          setItems(items);
        }}
        TreeItemComponent={MinimalTreeItemComponent}
      />
    </div>
  );
};

export default TimetablesTree;
