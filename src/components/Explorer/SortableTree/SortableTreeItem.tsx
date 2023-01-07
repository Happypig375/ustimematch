import type { UniqueIdentifier } from "@dnd-kit/core";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconChevronDown, IconGripVertical } from "@tabler/icons";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import Button from "@components/ui/Button";
import { chevronHalfVariants } from "@components/ui/variants";
import type { Timetable } from "../../../types/timetable";
import type { FolderItem } from "../../../types/tree";
import ColorChip from "../ColorChip";

interface Props {
  id: UniqueIdentifier;
  depth: number;
  clone?: boolean;
  indentationWidth: number;

  type: "FOLDER" | "TIMETABLE";
  folder?: FolderItem;
  collapsed?: boolean;
  childCount?: number;
  timetable?: Timetable;

  onClick?(): void;
  onRemove?(): void;
  onCollapse?(): void;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export function SortableTreeItem({
  id,
  depth,
  clone,
  indentationWidth,

  type,
  folder,
  collapsed,
  childCount,
  timetable,

  onClick,
  onRemove,
  onCollapse,
}: Props) {
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
    transition,
  };

  return (
    <li
      ref={setDroppableNodeRef}
      style={{ paddingLeft: `${indentationWidth * depth}px` }}
      className={clsx(
        "h-12 list-none",
        clone && "w-1/2",
        isDragging && "opacity-50",
      )}
    >
      <div
        ref={setDraggableNodeRef}
        style={style}
        onClick={onClick}
        className={clsx(
          "flex h-full items-center gap-2 rounded-md bg-bg-light-200 px-2",
          clone && "pointer-events-none shadow-tree-item",
          isDragging && "border border-border-gray-100",
          onClick && "cursor-pointer",
        )}
      >
        {/* {type === "FOLDER" && childCount ? (
          <div
            className="absolute top-full left-[16px] w-[1.5px] bg-bg-light-400"
            style={{ height: 48 * childCount }}
          />
        ) : null} */}

        {type === "FOLDER" && folder ? (
          <span className="flex flex-grow items-center gap-2 overflow-hidden">
            {onCollapse && (
              <Button
                icon
                plain
                onClick={(e) => {
                  e.stopPropagation();
                  onCollapse();
                }}
              >
                <motion.div
                  initial={false}
                  variants={chevronHalfVariants}
                  animate={collapsed ? "close" : "open"}
                >
                  <IconChevronDown stroke={1.75} className="h-5 w-5" />
                </motion.div>
              </Button>
            )}

            <span title={folder.name} className="truncate">
              {folder.name}
            </span>
          </span>
        ) : null}

        {type === "TIMETABLE" && timetable ? (
          <span className="flex flex-grow items-center gap-2 overflow-hidden pl-1">
            <ColorChip color={timetable.config.color} />
            <span title={timetable.name} className="truncate">
              {timetable.name}
            </span>
          </span>
        ) : null}

        {/* Children count badge */}
        {clone && childCount ? (
          <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-medium text-white">
            {childCount}
          </span>
        ) : null}

        {/* Drag handle */}
        <Button
          icon
          plain
          {...listeners}
          {...attributes}
          className="cursor-grab touch-none select-none"
        >
          <IconGripVertical stroke={1.75} className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
}
