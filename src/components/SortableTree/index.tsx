import type {
  Announcements,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  DropAnimation,
  Modifier,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import FolderForm from "@components/Form/FolderForm";
import TimetableForm from "@components/Form/TimetableForm";
import { actions, useStore } from "@store/index";
import {
  buildTree,
  flattenTree,
  getDepth,
  getProjection,
  removeChildrenOf,
} from "@utils/sortableTree";
import { sortableTreeKeyboardCoordinates } from "@utils/sortableTree/keyboardCoordinates";
import type {
  FlattenedItem,
  FolderItem,
  SensorContext,
  TimetableItem,
} from "../../types/tree";
import SortableTreeItem from "./SortableTreeItem";

const indentationWidth = 24;

const maxDepth = 2;

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const adjustTranslate: Modifier = ({ transform, draggingNodeRect }) => {
  if (!draggingNodeRect) return transform;
  return {
    ...transform,
    x: transform.x + draggingNodeRect.width,
  };
};

const dropAnimationConfig: DropAnimation = {
  duration: 200,
  easing: "ease",
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString(transform.final),
      },
    ];
  },
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      easing: "ease",
    });
  },
};

const SortableTree = () => {
  const items = useStore().timetable.timetablesTree();
  const setItems = actions.timetable.setTimetablesTree;
  const editTreeItem = actions.timetable.editTreeItem;
  const removeTreeItem = actions.timetable.removeTreeItem;
  const toggleVisibility = actions.timetable.toggleVisibility;
  const toggleFolderCollapse = actions.timetable.toggleFolderCollapse;

  // Editing modal for folder and timetable
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [openTimetableModal, setOpenTimetableModal] = useState(false);
  const [editingTimetable, setEditingTimetable] =
    useState<TimetableItem | null>(null);

  const onFolderClick = useCallback((folderItem: FolderItem) => {
    setOpenFolderModal(true);
    setEditingFolder(folderItem);
  }, []);

  const onTimetableClick = useCallback((timetableItem: TimetableItem) => {
    setOpenTimetableModal(true);
    setEditingTimetable(timetableItem);
  }, []);

  // Drag and drop states
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);

  // Flattened items without collapsed folders
  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);

    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { treeItem }) =>
        treeItem.type === "FOLDER" && treeItem.collapsed
          ? [...acc, treeItem.id]
          : acc,
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [activeId, items]);

  // Projection while dragging
  const projected = useMemo(
    () =>
      activeId && overId
        ? getProjection(
            flattenedItems,
            activeId,
            overId,
            offsetLeft,
            indentationWidth,
          )
        : null,
    [flattenedItems, offsetLeft, activeId, overId],
  );

  const sortedIds = useMemo(
    () => flattenedItems.map((item) => item.treeItem.id),
    [flattenedItems],
  );

  const activeItem = useMemo(
    () =>
      activeId
        ? flattenedItems.find((item) => item.treeItem.id === activeId)
        : null,
    [flattenedItems, activeId],
  );

  // Drag and drop event handler
  const resetState = useCallback(() => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", "");
  }, []);

  const handleDragStart = useCallback(
    ({ active: { id: activeId } }: DragStartEvent) => {
      setActiveId(activeId);
      setOverId(activeId);

      const activeItem = flattenedItems.find(
        (item) => item.treeItem.id === activeId,
      );

      if (activeItem) {
        setCurrentPosition({
          parentId: activeItem.parentId,
          overId: activeId,
        });
      }

      document.body.style.setProperty("cursor", "grabbing");
    },
    [flattenedItems],
  );

  const handleDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      resetState();

      if (projected && over) {
        const { depth, activeItem, parentId } = projected;

        // projected depth + depth of active item (in case dragging folder)
        if (depth + getDepth(activeItem.treeItem) > maxDepth)
          return toast.error("Depth limit exceeded");

        const clonedItems: FlattenedItem[] = JSON.parse(
          JSON.stringify(flattenTree(items)),
        );

        const overIndex = clonedItems.findIndex(
          (item) => item.treeItem.id === over.id,
        );

        const activeIndex = clonedItems.findIndex(
          (item) => item.treeItem.id === active.id,
        );

        const activeTreeItem = clonedItems[activeIndex];
        if (!activeTreeItem) return;

        clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

        const newItems = buildTree(sortedItems);

        setItems(newItems);
      }
    },
    [resetState, projected, items, setItems],
  );

  const handleDragCancel = useCallback(() => {
    resetState();
  }, [resetState]);

  // Drag and drop context
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indentationWidth),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  // Accessibility
  const getMovementAnnouncement = useCallback(
    (
      eventName: string,
      activeId: UniqueIdentifier,
      overId?: UniqueIdentifier,
    ) => {
      if (overId && projected) {
        if (eventName !== "onDragEnd") {
          if (
            currentPosition &&
            projected.parentId === currentPosition.parentId &&
            overId === currentPosition.overId
          ) {
            return;
          } else {
            setCurrentPosition({
              parentId: projected.parentId,
              overId,
            });
          }
        }

        const clonedItems: FlattenedItem[] = JSON.parse(
          JSON.stringify(flattenTree(items)),
        );
        const overIndex = clonedItems.findIndex(
          (item) => item.treeItem.id === overId,
        );
        const activeIndex = clonedItems.findIndex(
          (item) => item.treeItem.id === activeId,
        );
        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

        const activeItem = sortedItems[activeIndex];
        const previousItem = sortedItems[overIndex - 1];

        function getName(item: FlattenedItem) {
          return item.treeItem.type === "FOLDER"
            ? `Folder ${item.treeItem.name}`
            : item.treeItem.type === "TIMETABLE"
            ? `Timetable ${item.treeItem.timetable.name}`
            : null;
        }
        const activeName = activeItem ? getName(activeItem) : "";

        let announcement;
        const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
        const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

        if (!previousItem) {
          const nextItem = sortedItems[overIndex + 1];
          const nextName = nextItem ? getName(nextItem) : "";
          announcement = `${activeName} was ${movedVerb} before ${nextName}.`;
        } else {
          if (projected.depth > previousItem.depth) {
            const previousName = previousItem ? getName(previousItem) : "";
            announcement = `${activeName} was ${nestedVerb} under ${previousName}.`;
          } else {
            let previousSibling: FlattenedItem | undefined = previousItem;
            const previousSiblingName = previousSibling
              ? getName(previousSibling)
              : "";
            while (previousSibling && projected.depth < previousSibling.depth) {
              const parentId: UniqueIdentifier | null =
                previousSibling.parentId;
              previousSibling = sortedItems.find(
                (item) => item.treeItem.id === parentId,
              );
            }

            if (previousSibling) {
              announcement = `${activeName} was ${movedVerb} after ${previousSiblingName}.`;
            }
          }
        }

        return announcement;
      }

      return;
    },
    [items, currentPosition, projected],
  );

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        return `Picked up ${active.id}.`;
      },
      onDragMove({ active, over }) {
        return getMovementAnnouncement("onDragMove", active.id, over?.id);
      },
      onDragOver({ active, over }) {
        return getMovementAnnouncement("onDragOver", active.id, over?.id);
      },
      onDragEnd({ active, over }) {
        return getMovementAnnouncement("onDragEnd", active.id, over?.id);
      },
      onDragCancel({ active }) {
        return `Moving was cancelled. ${active.id} was dropped in its original position.`;
      },
    }),
    [getMovementAnnouncement],
  );

  return (
    <>
      <div className="focus-visible-ring h-full overflow-y-auto">
        <DndContext
          sensors={sensors}
          measuring={measuring}
          accessibility={{ announcements }}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          // Disable horizontal auto scrolling, 0.2 is the default value
          autoScroll={{ threshold: { x: 0, y: 0.2 } }}
        >
          <SortableContext
            items={sortedIds}
            strategy={verticalListSortingStrategy}
          >
            {flattenedItems.map(({ depth, treeItem }) => {
              return (
                <SortableTreeItem
                  id={treeItem.id}
                  key={treeItem.id}
                  treeItem={treeItem}
                  indentationWidth={indentationWidth}
                  illegal={
                    activeItem && treeItem.type === "FOLDER"
                      ? depth + getDepth(activeItem.treeItem) + 1 > maxDepth
                      : undefined
                  }
                  depth={
                    treeItem.id === activeId && projected
                      ? projected.depth
                      : depth
                  }
                  onCollapse={
                    treeItem.type === "FOLDER"
                      ? () => toggleFolderCollapse(treeItem.id)
                      : undefined
                  }
                  onClick={
                    treeItem.type === "FOLDER"
                      ? () => onFolderClick(treeItem)
                      : () => onTimetableClick(treeItem)
                  }
                  onEyeClick={() => toggleVisibility(treeItem.id)}
                />
              );
            })}

            {createPortal(
              <DragOverlay
                dropAnimation={dropAnimationConfig}
                modifiers={[adjustTranslate]}
              >
                {activeId && activeItem ? (
                  <SortableTreeItem
                    clone
                    depth={0}
                    id={activeId}
                    treeItem={activeItem.treeItem}
                    indentationWidth={indentationWidth}
                  />
                ) : null}
              </DragOverlay>,
              document.body,
            )}
          </SortableContext>
        </DndContext>

        {/* Folder editing modal */}
        <FolderForm
          open={openFolderModal}
          setOpen={setOpenFolderModal}
          folder={editingFolder ?? undefined}
          onDelete={() => editingFolder && removeTreeItem(editingFolder?.id)}
          onEdit={(name) =>
            editingFolder &&
            editTreeItem(editingFolder?.id, { ...editingFolder, name })
          }
        />

        {/* Timetable editing modal */}
        <TimetableForm
          open={openTimetableModal}
          setOpen={setOpenTimetableModal}
          timetable={editingTimetable?.timetable}
          onDelete={() =>
            editingTimetable && removeTreeItem(editingTimetable?.id)
          }
          onEdit={(timetable) =>
            editingTimetable &&
            editTreeItem(editingTimetable?.id, {
              ...editingTimetable,
              timetable,
            })
          }
        />
      </div>
    </>
  );
};

export default SortableTree;
