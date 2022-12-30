import Button from "@ui/Button";
import { useStore } from "../../store";
import { motion } from "framer-motion";
import { chevronVariants } from "@ui/variants";
import {
  IconChevronRight,
  IconClock,
  IconColumns,
  IconRefresh,
  IconShare,
} from "@tabler/icons";

const WeekView = () => {
  const showExplorer = useStore.use.showExplorer();
  const toggleShowExplorer = useStore.use.toggleShowExplorer();

  return (
    <div className="flex h-full min-w-full flex-grow flex-col sm:min-w-[unset]">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
        <Button icon title="Toggle Explorer" onClick={toggleShowExplorer}>
          <motion.div
            initial={false}
            animate={showExplorer ? "close" : "open"}
            variants={chevronVariants}
          >
            <IconChevronRight stroke={1.75} className="h-5 w-5" />
          </motion.div>
        </Button>

        <div className="flex gap-4 overflow-x-auto">
          <Button
            icon
            title="Toggle Weekend"
            // onClick={toggleShowWeekend}
          >
            <IconColumns stroke={1.75} className="h-5 w-5" />
            {/* <IconColumnsOff stroke={1.75} className="h-5 w-5" /> */}
          </Button>

          <Button
            icon
            title="Toggle Timematch"
            // onClick={toggleShowTimematch}
          >
            <IconClock stroke={1.75} className="h-5 w-5" />
          </Button>

          <Button
            icon
            title="Refresh"
            // className="!p-2"
            // onClick={refresh}
            // loading={loading}
            // disabled={loading}
          >
            <IconRefresh stroke={1.75} className="h-5 w-5" />
          </Button>

          <Button icon title="Share">
            <IconShare stroke={1.75} className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* <CalendarGrid /> */}

      {/* <ShareExportModal open={showShareModal} close={toggleShareModal} /> */}
    </div>
  );
};

export default WeekView;
