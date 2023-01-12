import type { Timetable } from "./timetable";

// id is used internally in SortableTree
// This is not same as timetable.config.id, which is used for flattened timetable.
interface BaseTreeItem {
  id: string;
  type: "FOLDER" | "TIMETABLE";
}

export interface FolderItem extends BaseTreeItem {
  type: "FOLDER";
  name: string;
  collapsed: boolean;
  children: TreeItem[];
}

export interface TimetableItem extends BaseTreeItem {
  type: "TIMETABLE";
  timetable: Timetable;
}

type TreeItem = FolderItem | TimetableItem;

export type TreeItems = TreeItem[];

// Used internally in SortableTree
export interface FlattenedItem {
  treeItem: TreeItem;
  parentId: string | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
