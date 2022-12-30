import {
  SortableTree,
  type TreeItemComponentProps,
  type TreeItems,
} from "dnd-kit-sortable-tree";
import { useState, forwardRef } from "react";
import TreeTimetableItem from "@ui/TreeTimetableItem";
import { useStore } from "@store/index";

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
];

const MinimalTreeItemComponent = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<MinimalTreeItemData>
>((props, ref) => {
  const explorerReorderMode = useStore.use.explorerReorderMode();

  return (
    <TreeTimetableItem
      {...props}
      ref={ref}
      manualDrag
      disableCollapseOnItemClick
      showDragHandle={explorerReorderMode}
    >
      <div className="flex items-center gap-2">
        <div>{props.item.value}</div>
      </div>
    </TreeTimetableItem>
  );
});
MinimalTreeItemComponent.displayName = "MinimalTreeItemComponent";

const TimetablesTree = () => {
  const [items, setItems] = useState(initialViableMinimalData);

  return (
    <div className="h-full overflow-y-auto">
      <SortableTree
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
