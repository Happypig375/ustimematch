import {
  IconChevronRight,
  IconClock,
  IconColumns,
  IconColumnsOff,
  IconRefresh,
  IconShare,
} from "@tabler/icons";
import { motion } from "framer-motion";
import Button from "@ui/Button";
import { chevronVariants } from "@ui/variants";
import { actions, useTrackedStore } from "@store/index";
import Grid from "./Grid";

const Controls = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();
  const toggleShowExplorer = actions.ui.toggleshowExplorer;
  const showWeekend = useTrackedStore().ui.showWeekend();
  const toggleShowWeekend = actions.ui.toggleShowWeekend;

  return (
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
        <Button icon title="Toggle Weekend" onClick={toggleShowWeekend}>
          {showWeekend ? (
            <IconColumns stroke={1.75} className="h-5 w-5" />
          ) : (
            <IconColumnsOff stroke={1.75} className="h-5 w-5" />
          )}
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
  );
};

const WeekView = () => {
  return (
    <div className="flex h-full min-w-full flex-grow flex-col sm:min-w-[unset]">
      <Controls />
      <Grid />
    </div>
  );
};

export default WeekView;
