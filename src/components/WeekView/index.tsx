import {
  IconChevronRight,
  IconClock,
  IconClockOff,
  IconColumns,
  IconColumnsOff,
  IconMoonStars,
  IconSunHigh,
} from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Refresh from "@components/Refresh";
import Button from "@ui/Button";
import { chevronVariants, themeVariants } from "@ui/variants";
import { actions, useTrackedStore } from "@store/index";
import Grid from "./Grid";

const Controls = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();
  const showWeekend = useTrackedStore().ui.showWeekend();
  const showTimematch = useTrackedStore().ui.showTimematch();
  const toggleShowExplorer = actions.ui.toggleshowExplorer;
  const toggleShowWeekend = actions.ui.toggleShowWeekend;
  const toggleShowTimematch = actions.ui.toggleShowTimematch;
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-100 px-4 py-2">
      <Button icon title="Toggle Explorer" onClick={toggleShowExplorer}>
        <motion.div
          initial={false}
          animate={showExplorer ? "close" : "open"}
          variants={chevronVariants}
        >
          <IconChevronRight stroke={1.75} className="h-5 w-5" />
        </motion.div>
      </Button>

      <div className="flex gap-4">
        <Button icon title="Toggle Timematch" onClick={toggleShowTimematch}>
          {showTimematch ? (
            <IconClock stroke={1.75} className="h-5 w-5" />
          ) : (
            <IconClockOff stroke={1.75} className="h-5 w-5" />
          )}
        </Button>

        <Button icon title="Toggle Weekend" onClick={toggleShowWeekend}>
          {showWeekend ? (
            <IconColumns stroke={1.75} className="h-5 w-5" />
          ) : (
            <IconColumnsOff stroke={1.75} className="h-5 w-5" />
          )}
        </Button>

        <Refresh />

        {/* <Share /> */}
        {/* Theme toggle */}
        <Button
          icon
          title={`Toggle ${theme === "light" ? "Dark" : "Light"} Mode`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="transition-shadow dark:hover:shadow-[0_0_16px_4px_#1e40af40] dark:active:shadow-[0_0_16px_4px_#1e40af40]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {theme === "light" && (
              <motion.div
                exit="exit"
                initial="exit"
                animate="enter"
                variants={themeVariants}
              >
                <IconSunHigh stroke={1.75} className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false} mode="popLayout">
            {theme === "dark" && (
              <motion.div
                exit="exit"
                initial="exit"
                animate="enter"
                variants={themeVariants}
              >
                <IconMoonStars stroke={1.75} className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
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
