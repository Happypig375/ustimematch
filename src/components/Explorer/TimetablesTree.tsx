import { IconEye } from "@tabler/icons";
import {
  SortableTree,
  type TreeItemComponentProps,
  type TreeItems,
} from "dnd-kit-sortable-tree";
import { useState, forwardRef, Dispatch, SetStateAction } from "react";
import Button from "@components/ui/Button";
import TreeTimetableItem from "@ui/TreeTimetableItem";
import { useStore } from "@store/index";
import { Timetable, TimetableConfig } from "../../types/timetable";

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

interface Props {
  onClick: (timetable: Timetable, timetableConfig: TimetableConfig) => void;
  onEyeClick: (timetable: Timetable, timetableConfig: TimetableConfig) => void;
}

const TimetablesTree = ({ onClick, onEyeClick }: Props) => {
  const [items, setItems] = useState(initialViableMinimalData);

  const timetables = useStore.use.timetables();
  const timetablesConfigs = useStore.use.timetablesConfigs();

  return (
    <div className="h-full overflow-y-auto">
      {/* <SortableTree
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
      /> */}
      {timetables.map((timetable, i) => (
        <div
          className="flex justify-between"
          key={timetablesConfigs[i]?.id}
          onClick={() => {
            timetablesConfigs[i] &&
              onClick(timetable, timetablesConfigs[i] as TimetableConfig);
          }}
        >
          name: {timetable.name} visible:{" "}
          {timetablesConfigs[i]?.visible.toString()}
          <Button
            icon
            plain
            onClick={(e) => {
              e.stopPropagation();
              timetablesConfigs[i] &&
                onEyeClick(timetable, timetablesConfigs[i] as TimetableConfig);
            }}
          >
            <IconEye stroke={1.75} className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TimetablesTree;
