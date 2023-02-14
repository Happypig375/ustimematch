import type { UniqueIdentifier } from "@dnd-kit/core";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconGripVertical,
} from "@tabler/icons-react";
import clsx from "clsx";
import { m } from "framer-motion";
import type { CSSProperties } from "react";
import Button from "@components/ui/Button";
import { chevronHalfVariants } from "@components/ui/motion/variants";
import { getFolderVisible, getTimetableCount } from "@utils/sortableTree";
import type { TreeItem } from "../../../types/tree";
import ColorChip from "../ColorChip";

interface Props {
  id: UniqueIdentifier;
  depth: number;
  clone?: boolean;
  illegal?: boolean;
  indentationWidth: number;

  treeItem: TreeItem;

  onClick?: () => void;
  onEyeClick?: () => void;
  onCollapse?: () => void;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

const SortableTreeItem = ({
  id,
  depth,
  clone,
  illegal,
  indentationWidth,

  treeItem,

  onClick,
  onEyeClick,
  onCollapse,
}: Props) => {
  const {
    transform,
    transition,
    listeners,
    attributes,
    isDragging,
    setDroppableNodeRef,
    setDraggableNodeRef,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // For active opacity transition
    transition: "opacity 200ms ease, " + transition,
  };

  const isFolder = treeItem.type === "FOLDER";
  const isTimetable = treeItem.type === "TIMETABLE";

  const name = isFolder
    ? treeItem.name
    : isTimetable
    ? treeItem.timetable.name
    : "";

  const visible =
    (isFolder && getFolderVisible(treeItem)) ||
    (isTimetable && treeItem.timetable.config.visible);

  const timetableCount = isFolder ? getTimetableCount(treeItem) : -1;

  return (
    <li
      ref={setDroppableNodeRef}
      style={{ paddingLeft: `${indentationWidth * depth}px` }}
      className={clsx(
        "h-12 list-none",
        clone && "w-1/2",
        // Items must be relatively positioned to be given higher z-index
        // https://github.com/clauderic/dnd-kit/issues/503
        isDragging && "relative z-10",
      )}
    >
      <div
        style={style}
        onClick={onClick}
        ref={setDraggableNodeRef}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
        className={clsx(
          "focus-visible-ring flex h-full cursor-pointer select-none items-center gap-2 rounded-md px-2 text-fg-100",
          "hover:bg-bg-300/50 hover:text-fg-200 active:[&:not(:focus-within)]:bg-bg-300",
          clone && "pointer-events-none bg-bg-200 shadow-elevation",
          isDragging && "border border-border-200 opacity-50",
          !isDragging && illegal && "opacity-25",
        )}
        data-cy="sortable-tree-item"
      >
        {/* Folder item collapse button and name */}
        {isFolder && (
          <>
            <Button
              icon
              plain
              // Align with color chip
              className="ml-1"
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onCollapse && onCollapse();
              }}
              title={`${treeItem.collapsed ? "Expand" : "Collapse"} ${name}`}
            >
              <m.div
                initial={false}
                variants={chevronHalfVariants}
                animate={treeItem.collapsed ? "close" : "open"}
              >
                <IconChevronDown strokeWidth={1.75} className="h-5 w-5" />
              </m.div>
            </Button>

            <span title={name} className="flex-grow truncate">
              {name}
            </span>
          </>
        )}

        {/* Timetable item color chip and name */}
        {isTimetable && (
          <>
            <ColorChip
              // Align with folder collapse button
              className="ml-2"
              color={treeItem.timetable.config.color}
            />
            <span title={name} className="flex-grow truncate">
              {name}
            </span>
          </>
        )}

        {/* Children count badge on clone while dragging */}
        {clone && isFolder && (
          <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-800 text-xs font-medium text-white">
            {timetableCount}
          </span>
        )}

        {/* Toggle visibility button */}
        {!clone && (isTimetable || timetableCount > 0) && (
          <Button
            icon
            plain
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEyeClick && onEyeClick();
            }}
            title={`${visible ? "Hide" : "Show"}${
              isFolder ? " All Timetables of " : " "
            }${name}`}
          >
            {visible ? (
              <IconEye strokeWidth={1.75} className="h-5 w-5" />
            ) : (
              <IconEyeOff strokeWidth={1.75} className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Drag handle */}
        <Button
          icon
          plain
          {...listeners}
          {...attributes}
          className="cursor-grab touch-none"
          onKeyDown={(e) => e.stopPropagation()}
          title={`Drag${isFolder ? " Folder " : " "}${name}`}
        >
          <IconGripVertical strokeWidth={1.75} className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
};

export default SortableTreeItem;
