import clsx from "clsx";
import { forwardRef } from "react";
import type { TreeItemComponentProps } from "dnd-kit-sortable-tree";
import { type TreeItemComponentType } from "../../types/tree";
import Button from "./Button";
import {
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconEyeOff,
  IconFolder,
  IconGripVertical,
} from "@tabler/icons";

/* eslint-disable-next-line @typescript-eslint/ban-types */
const TreeTimetableItem: TreeItemComponentType<{}, HTMLDivElement> = forwardRef<
  HTMLDivElement,
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  React.PropsWithChildren<TreeItemComponentProps<{}>>
>((props, ref) => {
  const {
    clone,
    depth,
    disableSelection,
    disableInteraction,
    disableSorting,
    ghost,
    handleProps,
    indentationWidth,
    indicator,
    collapsed,
    onCollapse,
    onRemove,
    item,
    wrapperRef,
    style,
    hideCollapseButton,
    childCount,
    manualDrag,
    showDragHandle,
    disableCollapseOnItemClick,
    isLast,
    parent,
    className,
    contentClassName,
    ...rest
  } = props;

  return (
    <li
      ref={wrapperRef}
      {...rest}
      className={clsx(
        "list-none !transition-none",
        (clone || ghost) &&
          "rounded-md border border-border-gray-100 bg-bg-light-100",
        clone && "opacity-40 shadow-tree-item",
        ghost && "opacity-80",
        disableSelection && "",
        disableInteraction && "",
        className,
      )}
      style={{
        ...style,
        marginLeft: clone ? indentationWidth : indentationWidth * depth,
      }}
    >
      <div
        className={clsx(
          "flex items-center gap-2 rounded-md bg-bg-light-200 py-2 px-3",
          !disableCollapseOnItemClick && !!childCount && "cursor-pointer",
          contentClassName,
        )}
        ref={ref}
        {...(manualDrag ? undefined : handleProps)}
        onClick={disableCollapseOnItemClick ? undefined : onCollapse}
      >
        {!clone &&
          !!childCount &&
          (collapsed ? (
            <IconFolder stroke={1.75} className="h-5 w-5" />
          ) : (
            <IconFolder stroke={1.75} className="h-5 w-5" />
          ))}

        {props.children}

        {/* Spacer */}
        <div className="flex-grow" />

        <Button icon plain>
          <IconEye stroke={1.75} className="h-5 w-5" />
          {/* <IconEyeOff stroke={1.5} className="h-5 w-5" /> */}
          {/* <TbEye /> */}
          {/* <TbEyeOff /> */}
        </Button>

        {!clone && !!childCount && (
          <Button icon plain onClick={onCollapse}>
            {collapsed ? (
              <IconChevronDown stroke={1.75} className="h-5 w-5" />
            ) : (
              <IconChevronUp stroke={1.75} className="h-5 w-5" />
            )}
          </Button>
        )}

        {!disableSorting && showDragHandle && (
          // Only draggable from handle (prevent mobile scrolling issue)

          <IconGripVertical
            {...props.handleProps}
            stroke={1.75}
            className="h-4 w-4 cursor-move touch-none"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </li>
  );
});
TreeTimetableItem.displayName = "TreeItemWrapper";

export default TreeTimetableItem;
