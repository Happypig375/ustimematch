// Based off of dnd-kit's example
// https://github.com/clauderic/dnd-kit/tree/master/stories/3%20-%20Examples/Tree
import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import type { Timetable } from "../../types/timetable";
import type {
  FlattenedItem,
  TimetableItem,
  TreeItem,
  TreeItems,
} from "../../types/tree";
import type { FolderItem } from "./../../types/tree";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex((item) => item.treeItem.id === overId);
  const activeItemIndex = items.findIndex(
    (item) => item.treeItem.id === activeId,
  );
  const activeItem = items[activeItemIndex];
  if (!activeItem) return;

  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);

  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth(previousItem);
  const minDepth = getMinDepth(nextItem);

  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) depth = maxDepth;
  else if (projectedDepth < minDepth) depth = minDepth;

  return { depth, maxDepth, minDepth, activeItem, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.treeItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth(previousItem?: FlattenedItem) {
  if (previousItem?.treeItem.type === "FOLDER") return previousItem.depth + 1;

  // Prevent nesting under timetable item
  if (previousItem?.treeItem.type === "TIMETABLE") return previousItem.depth;

  // First item
  return 0;
}

function getMinDepth(nextItem?: FlattenedItem) {
  if (nextItem) return nextItem.depth;

  // Last item
  return 0;
}

// Finding the depth of an tree item's children
export function getDepth(item: TreeItem): number {
  if (item.type !== "FOLDER" || item.children.length === 0) return 0;

  const childDepth = [];

  for (const child of item.children) {
    childDepth.push(getDepth(child) + 1);
  }

  return Math.max(...childDepth);
}

function flatten(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    if (item.type === "FOLDER")
      return [
        ...acc,
        { treeItem: item, parentId, depth, index },
        ...flatten(item.children, item.id, depth + 1),
      ];
    return [...acc, { treeItem: item, parentId, depth, index }];
  }, []);
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = {
    id: "root",
    name: "root",
    type: "FOLDER",
    collapsed: false,
    children: [],
  };

  const nodes: Record<string, TreeItem> = { [root.id]: root };
  // const items = flattenedItems.map((item) => ({ ...item, children: [] }));
  const items: FlattenedItem[] = flattenedItems.map(
    ({ treeItem, depth, index, parentId }) => {
      if (treeItem.type === "FOLDER")
        return {
          depth,
          index,
          parentId,
          treeItem: {
            ...treeItem,
            children: [],
          },
        };

      return {
        treeItem,
        depth,
        index,
        parentId,
      };
    },
  );

  for (const item of items) {
    // const { id, children } = item.treeItem;
    const parentId = item.parentId ?? root.id;
    const parent =
      nodes[parentId] ??
      findItem(
        items.map((item) => item.treeItem),
        parentId,
      );

    if (item.treeItem.type === "FOLDER")
      nodes[item.treeItem.id] = {
        id: item.treeItem.id,
        children: item.treeItem.children,
        collapsed: item.treeItem.collapsed,
        name: item.treeItem.name,
        type: "FOLDER",
      };

    // parent?.children.push(item);
    parent && parent.type === "FOLDER" && parent.children.push(item.treeItem);
  }

  return root.children;
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: TreeItems,
  itemId: UniqueIdentifier,
): TreeItem | undefined {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }

    if (item.type === "FOLDER" && item.children.length) {
      const child = findItemDeep(item.children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.type === "FOLDER" && item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

function countChildren(items: TreeItem[], count = 0): number {
  return items.reduce((acc, item) => {
    if (item.type === "FOLDER" && item.children.length) {
      return countChildren(item.children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
  const item = findItemDeep(items, id);

  return item && item.type === "FOLDER" ? countChildren(item.children) : 0;
}

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.treeItem.type === "FOLDER" && item.treeItem.children.length) {
        excludeParentIds.push(item.treeItem.id);
      }
      return false;
    }

    return true;
  });
}

export function getFlattenedTimetables(children: TreeItem[]): Timetable[] {
  return children.reduce<Timetable[]>((acc, item) => {
    if (item.type === "FOLDER" && item.children.length > 0)
      return [...acc, ...getFlattenedTimetables(item.children)];
    if (item.type === "TIMETABLE") return [...acc, item.timetable];
    return acc;
  }, []);
}

/**
 * @returns All items flattened within a tree
 */
export function rawFlatten(items: TreeItems): TreeItem[] {
  return items.reduce<TreeItem[]>((acc, item) => {
    if (item.type === "FOLDER" && item.children.length > 0)
      return [...acc, item, ...rawFlatten(item.children)];
    return [...acc, item];
  }, []);
}

/**
 * @returns whether a folder's children are visible
 *
 * @true at least one timetable are visible
 *
 * @false all timetables are not visible
 */
export function getFolderVisible(folderItem: FolderItem): boolean {
  let visible = false;

  for (const item of folderItem.children) {
    if (item.type === "TIMETABLE" && item.timetable.config.visible) {
      return true;
    } else if (item.type === "FOLDER" && item.children.length > 0) {
      visible = getFolderVisible(item);
    }
  }

  return visible;
}

/**
 * @returns a folder item with its children's timetable's visiblity toggled with respect to parameter
 */
export function toggleFolderVisibility(
  folderItem: FolderItem,
  folderVisible: boolean,
): FolderItem {
  const newChildren = folderItem.children.reduce<TreeItem[]>((acc, child) => {
    if (child.type === "FOLDER")
      return [...acc, toggleFolderVisibility(child, folderVisible)];
    if (child.type === "TIMETABLE")
      return [
        ...acc,
        {
          ...child,
          timetable: {
            ...child.timetable,
            config: {
              ...child.timetable.config,
              visible: !folderVisible,
            },
          },
        },
      ];
    return acc;
  }, []);

  return { ...folderItem, children: newChildren };
}

/**
 * Used to determine whether to show toggle visibility button or not,
 * also used in determining whether to show a folder in select component.
 *
 * @returns number of timetables of a given folder
 */
export function getTimetableCount(
  folderItem: FolderItem,
  filter: (timetable: Timetable) => boolean = () => true,
): number {
  let timetableCount = 0;
  for (const child of folderItem.children) {
    if (child.type === "TIMETABLE" && filter(child.timetable))
      timetableCount += 1;
    if (child.type === "FOLDER")
      timetableCount += getTimetableCount(child, filter);
  }

  return timetableCount;
}

/**
 * Find timetable item in tree by timetable id
 */
export function findTimetableByIdDeep(
  items: TreeItems,
  timetableId: string,
): TimetableItem | undefined {
  for (const item of items) {
    if (item.type === "TIMETABLE" && item.timetable.config.id === timetableId)
      return item;

    if (item.type === "FOLDER" && item.children.length > 0) {
      const child = findTimetableByIdDeep(item.children, timetableId);

      if (child) return child;
    }
  }

  return undefined;
}

/**
 * Used for local storage migration.
 * @param ids The timetable id that should be included.
 * @returns A timetable tree with only the given ids, excluding empty folders.
 *
 * Note that new id will be generated for both tree and timetable, this is to prevent key duplication.
 */
export function filterByTimetableIds(
  items: TreeItems,
  timetableIds: string[],
): TreeItems {
  return items.reduce<TreeItem[]>((acc, item) => {
    if (
      item.type === "FOLDER" &&
      getTimetableCount(item, ({ config: { id } }) =>
        timetableIds.includes(id),
      ) > 0
    )
      return [
        ...acc,
        {
          ...item,
          id: nanoid(),
          children: filterByTimetableIds(item.children, timetableIds),
        },
      ];

    if (
      item.type === "TIMETABLE" &&
      timetableIds.includes(item.timetable.config.id)
    )
      return [...acc, { ...item, id: nanoid() }];

    return acc;
  }, []);
}

function flattenNonEmpty(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    if (item.type === "FOLDER" && getTimetableCount(item) > 0)
      return [
        ...acc,
        { treeItem: item, parentId, depth, index },
        ...flattenNonEmpty(item.children, item.id, depth + 1),
      ];

    if (item.type === "TIMETABLE")
      return [...acc, { treeItem: item, parentId, depth, index }];

    return acc;
  }, []);
}

/**
 * @returns A flattened tree without empty folders
 */
export function flattenTreeNonEmpty(items: TreeItems): FlattenedItem[] {
  return flattenNonEmpty(items);
}
