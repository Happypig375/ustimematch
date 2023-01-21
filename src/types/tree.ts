import type { MutableRefObject } from "react";
import { z } from "zod";
import type { Timetable } from "./timetable";
import { ZTimetable } from "./timetable";

// id is used internally in SortableTree
// This is not the same as timetable.config.id, which is used for flattened timetable.
const ZBaseTreeItem = z.object({
  id: z.string(),
  type: z.enum(["FOLDER", "TIMETABLE"]),
});

export type BaseTreeItem = z.infer<typeof ZBaseTreeItem>;

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

export type TreeItem = FolderItem | TimetableItem;

export type TreeItems = TreeItem[];

// https://zod.dev/?id=recursive-types
export const ZTreeItem: z.ZodType<TreeItem> = z.discriminatedUnion("type", [
  ZBaseTreeItem.extend({
    type: z.literal("FOLDER"),
    name: z.string(),
    collapsed: z.boolean(),
    children: z.lazy(() => ZTreeItem.array()),
  }),
  ZBaseTreeItem.extend({
    type: z.literal("TIMETABLE"),
    timetable: ZTimetable,
  }),
]);

export const ZTreeItems = ZTreeItem.array();

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
