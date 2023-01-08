import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { FlattenedItem, TreeItem, TreeItems } from "../../types/tree";
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

  const maxDepth = getMaxDepth(activeItem, previousItem);

  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

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

function getMaxDepth(activeItem: FlattenedItem, previousItem?: FlattenedItem) {
  if (previousItem?.treeItem.type === "FOLDER") {
    const actualDepth = previousItem.depth + 1;

    // Prevent nesting further if item's children dpeth + actual depth > 4 (max depth)
    if (getDepth(activeItem.treeItem) + actualDepth > 4)
      return previousItem.depth;

    return actualDepth;
  } else if (previousItem?.treeItem.type === "TIMETABLE") {
    // Prevent nesting under timetable item
    return previousItem.depth;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem?: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

// Finding the depth of an tree item's children
function getDepthHelper(item: TreeItem): number {
  if (item.type !== "FOLDER" || item.children.length === 0) return 0;
  for (const child of item.children) {
    return getDepthHelper(child) + 1;
  }
  return 0;
}
function getDepth(item: TreeItem) {
  return getDepthHelper(item);
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

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.type === "FOLDER" && item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }

  return [...items];
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
 * @returns a folder item with its children's timetable's visiblity toggled with regards to {@link getFolderVisible}
 */
export function toggleFolderVisibility(folderItem: FolderItem): FolderItem {
  const folderVisible = getFolderVisible(folderItem);

  const newChildren = folderItem.children.reduce<TreeItem[]>((acc, child) => {
    if (child.type === "FOLDER") return [...acc, toggleFolderVisibility(child)];
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
 * Used to determine whether to show toggle visibility button or not
 *
 * @returns number of timetables of a given folder
 */
export function getTimetableCount(folderItem: FolderItem): number {
  let timetableCount = 0;

  for (const child of folderItem.children) {
    if (child.type === "TIMETABLE") timetableCount += 1;
    if (child.type === "FOLDER") timetableCount += getTimetableCount(child);
  }

  return timetableCount;
}
