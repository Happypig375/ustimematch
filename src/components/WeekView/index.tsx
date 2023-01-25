import {
  IconChevronRight,
  IconClock,
  IconClockOff,
  IconColumns,
  IconColumnsOff,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Refresh from "@components/Refresh";
import ThemeToggle from "@components/ThemeToggle";
import Button from "@components/ui/Button";
import { chevronVariants } from "@components/ui/variants";
import { actions, useTrackedStore } from "@store/index";
import Grid from "./Grid";

const Controls = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();
  const showWeekend = useTrackedStore().ui.showWeekend();
  const showTimematch = useTrackedStore().ui.showTimematch();
  const toggleShowExplorer = actions.ui.toggleshowExplorer;
  const toggleShowWeekend = actions.ui.toggleShowWeekend;
  const toggleShowTimematch = actions.ui.toggleShowTimematch;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-100 pl-2">
      <Button icon title="Toggle Explorer" onClick={toggleShowExplorer}>
        <motion.div
          initial={false}
          animate={showExplorer ? "close" : "open"}
          variants={chevronVariants}
        >
          <IconChevronRight strokeWidth={1.75} className="h-5 w-5" />
        </motion.div>
      </Button>

      <div
        className="flex gap-4 overflow-auto p-2"
        data-tour="weekview-controls"
      >
        <Button icon title="Toggle Timematch" onClick={toggleShowTimematch}>
          {showTimematch ? (
            <IconClock strokeWidth={1.75} className="h-5 w-5" />
          ) : (
            <IconClockOff strokeWidth={1.75} className="h-5 w-5" />
          )}
        </Button>

        <Button icon title="Toggle Weekend" onClick={toggleShowWeekend}>
          {showWeekend ? (
            <IconColumns strokeWidth={1.75} className="h-5 w-5" />
          ) : (
            <IconColumnsOff strokeWidth={1.75} className="h-5 w-5" />
          )}
        </Button>

        <Refresh />

        <ThemeToggle />
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
