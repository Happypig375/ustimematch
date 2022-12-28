import clsx from "clsx";
import { forwardRef } from "react";
import type { TreeItemComponentProps } from "dnd-kit-sortable-tree";
import { type TreeItemComponentType } from "../../types/tree";
import {
  Bars3Icon,
  ChevronUpDownIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

const TreeTimetableItem: TreeItemComponentType<{}, HTMLDivElement> = forwardRef<
  HTMLDivElement,
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
        "list-none",
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
            <FolderIcon className="h-5 w-5" />
          ) : (
            <FolderOpenIcon className="h-5 w-5" />
          ))}

        {props.children}
        {!disableSorting && (
          // Only draggable from handle (prevent mobile scrolling issue)
          <div
            {...props.handleProps}
            className="ml-auto cursor-move touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Bars3Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </li>
  );
});
TreeTimetableItem.displayName = "TreeItemWrapper";

export default TreeTimetableItem;
