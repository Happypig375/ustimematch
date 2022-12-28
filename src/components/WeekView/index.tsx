import Button from "@ui/Button";
import {
  Bars2Icon,
  Bars4Icon,
  ArrowPathIcon,
  ChevronRightIcon,
  ClockIcon as OutlineClockIcon,
  Bars3Icon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon as SolidClockIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import { chevronVariants } from "@ui/variants";

const MotionChevronRightIcon = motion(ChevronRightIcon);

const WeekView = () => {
  const showExplorer = useStore.use.showExplorer();
  const toggleShowExplorer = useStore.use.toggleShowExplorer();

  return (
    <div className="flex h-full min-w-full flex-grow flex-col sm:min-w-[unset]">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
        <Button icon title="Toggle Explorer" onClick={toggleShowExplorer}>
          <MotionChevronRightIcon
            initial={false}
            animate={showExplorer ? "close" : "open"}
            variants={chevronVariants}
            className="h-5 w-5"
          />
        </Button>

        <div className="flex gap-4 overflow-x-auto">
          <Button
            icon
            title="Toggle Weekend"
            // onClick={toggleShowWeekend}
          >
            <Bars2Icon className="h-5 w-5 rotate-90" />
            {/* <Bars4Icon className="h-5 w-5 rotate-90" /> */}
          </Button>

          <Button
            icon
            title="Toggle Timematch"
            // onClick={toggleShowTimematch}
          >
            <OutlineClockIcon className="h-5 w-5" />
            {/* <SolidClockIcon className="h-5 w-5" /> */}
          </Button>

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

          <Button icon title="Share">
            <ShareIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* <CalendarGrid /> */}

      {/* <ShareExportModal open={showShareModal} close={toggleShareModal} /> */}
    </div>
  );
};

export default WeekView;
