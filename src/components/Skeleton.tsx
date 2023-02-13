import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { useTrackedStore } from "@store/index";
import { WEEKVIEW_ROWS } from "@store/ui";
import Border from "./WeekView/Border";
import Legend from "./WeekView/Legend";
import Timeline from "./WeekView/Timeline";

interface SkeletonButtonProps extends HTMLAttributes<HTMLDivElement> {
  icon?: boolean;
  fullWidth?: boolean;
}

const SkeletonItem = ({ icon, fullWidth, className }: SkeletonButtonProps) => {
  return (
    <div
      className={clsx(
        className,
        icon && "w-10",
        fullWidth && "w-full",
        "relative h-10 overflow-hidden rounded-md bg-bg-300",
        "before:absolute before:inset-0 before:-translate-x-1/2 before:animate-[shimmer_2s_infinite] before:bg-shimmer",
      )}
    />
  );
};

const Skeleton = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();
  const weekViewCols = useTrackedStore().ui.weekViewCols();

  // All the styles are inherited from the respective components
  return (
    <div className="flex w-full">
      {/* Explorer */}
      {showExplorer && (
        <div className="flex h-full w-[clamp(256px,20%,512px)] flex-shrink-0 flex-col border-r border-border-100">
          {/* Controls */}
          <div className="flex gap-2 border-b border-border-100 p-2">
            <SkeletonItem className="flex-grow" />
            <SkeletonItem icon />
            <SkeletonItem icon />
          </div>

          {/* Sortable tree */}
          <div className="h-full overflow-y-auto p-2">
            <SkeletonItem className="mb-2" />
            <SkeletonItem className="mb-2" />
            <SkeletonItem className="mb-2" />
            <SkeletonItem className="mb-2" />
          </div>

          {/* Personal timetable */}
          <div className="border-t border-border-100 p-2">
            <SkeletonItem fullWidth />
          </div>
        </div>
      )}

      {/* Week view */}
      <div className="flex h-full min-w-full flex-grow flex-col sm:min-w-[unset]">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 border-b border-border-100 p-2">
          <SkeletonItem icon className="mr-auto" />
          <SkeletonItem icon />
          <SkeletonItem icon />
          <SkeletonItem icon />
          <SkeletonItem icon />
        </div>

        {/* Grid */}
        <div
          className="focus-visible-ring grid h-full overflow-y-auto"
          style={{
            gridTemplateRows: `auto repeat(${WEEKVIEW_ROWS}, minmax(12px,1fr))`,
            gridTemplateColumns: `auto repeat(${weekViewCols}, minmax(0,1fr))`,
          }}
        >
          <Legend />
          <Border />
          <Timeline />

          {/* Skeleton */}
          <div
            style={{
              gridArea: "1 / 1 / -1 / -1",
            }}
            className={clsx(
              "relative overflow-hidden bg-bg-300 opacity-80",
              "before:absolute before:inset-0 before:-translate-x-1/2 before:animate-[shimmer_2s_infinite] before:bg-shimmer",
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
