import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import * as Separator from "@radix-ui/react-separator";
import { IconChevronDown, IconFolder, IconGripVertical } from "@tabler/icons";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import ColorChip from "@components/Explorer/ColorChip";
import Button from "@components/ui/Button";
import { chevronHalfVariants } from "@components/ui/variants";
import type { Timetable } from "../../../types/timetable";
import type { FolderItem } from "../../../types/tree";

export interface Props
  extends Omit<HTMLAttributes<HTMLLIElement>, "id" | "onClick"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: DraggableAttributes | SyntheticListenerMap;
  indicator?: boolean;
  indentationWidth: number;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  type: "TIMETABLE" | "FOLDER";
  folder?: FolderItem;
  timetable?: Timetable;
  onClick?(): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      wrapperRef,
      type,
      folder,
      timetable,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <li
        {...props}
        ref={wrapperRef}
        style={{ paddingLeft: `${indentationWidth * depth}px` }}
        className={clsx(
          "h-12 list-none",
          clone && "w-1/2",
          ghost && indicator && "opacity-50",
        )}
      >
        <div
          ref={ref}
          style={style}
          onClick={onClick}
          className={clsx(
            "relative flex h-full items-center gap-2 rounded-md bg-bg-light-200 px-2 hover:z-10 hover:shadow-tree-item",
            clone && "pointer-events-none shadow-tree-item",
            ghost && indicator && "border border-border-gray-100",
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
            {...handleProps}
            className="cursor-grab touch-none select-none"
          >
            <IconGripVertical stroke={1.75} className="h-5 w-5" />
          </Button>
        </div>
      </li>
    );
  },
);
TreeItem.displayName = "TreeItem";
