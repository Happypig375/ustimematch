import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { FlattenedItem, TreeItem, TreeItems } from "../../../types/tree";

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

  const maxDepth = getMaxDepth({
    previousItem,
  });

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

function getMaxDepth({ previousItem }: { previousItem?: FlattenedItem }) {
  if (previousItem?.treeItem.type === "FOLDER") {
    return previousItem.depth + 1;
  } else if (previousItem?.treeItem.type === "TIMETABLE") {
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
