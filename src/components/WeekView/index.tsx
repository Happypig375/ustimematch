import Button from "@ui/Button";
import {
  ArrowPathIcon,
  Bars2Icon,
  Bars4Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon as OutlineClockIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon as SolidClockIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../store";

const WeekView = () => {
  const showExplorer = useStore.use.showExplorer();
  const toggleShowExplorer = useStore.use.toggleShowExplorer();

  return (
    <div className="flex h-full min-w-full flex-grow flex-col sm:min-w-[unset]">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
        <Button icon title="Toggle Explorer" onClick={toggleShowExplorer}>
          {showExplorer ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </Button>

        <div className="flex gap-4 overflow-x-auto">
          <Button
            icon
            title="Refresh"
            // className="!p-2"
            // onClick={refresh}
            // loading={loading}
            // disabled={loading}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </Button>

          <Button
            icon
            title="Toggle Weekend"
            // onClick={toggleShowWeekend}
          >
            <Bars2Icon className="h-5 w-5 rotate-90" />
            <Bars4Icon className="h-5 w-5 rotate-90" />
          </Button>

          <Button
            icon
            title="Toggle Timematch"
            // onClick={toggleShowTimematch}
          >
            <OutlineClockIcon className="h-5 w-5" />
            <SolidClockIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* <CalendarGrid /> */}

      {/* <ShareExportModal open={showShareModal} close={toggleShareModal} /> */}
    </div>
  );
};

export default WeekView;
