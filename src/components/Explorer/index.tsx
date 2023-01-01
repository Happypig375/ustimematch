import { IconFolderPlus, IconPlus, IconSwitchVertical } from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@ui/Button";
import { explorerVariants } from "@ui/variants";
import { useStore } from "@store/index";
import PersonalTimetable from "./PersonalTimetable";
import TimetablesTree from "./TimetablesTree";

const Explorer = () => {
  const showExplorer = useStore.use.showExplorer();
  const explorerReorderMode = useStore.use.explorerReorderMode();
  const toggleExplorerReorderMode = useStore.use.toggleExplorerReorderMode();

  return (
    <AnimatePresence initial={false}>
      {showExplorer && (
        <motion.div
          exit="close"
          animate="open"
          initial="close"
          variants={explorerVariants}
          className="flex h-full w-[clamp(256px,20%,512px)] flex-shrink-0 snap-start flex-col border-r border-border-gray-100"
        >
          {/* Buttons */}
          <div className="flex gap-2 border-b border-border-gray-100 px-4 py-2">
            <Button
              fullWidth
              title="Import"
              // onClick={toggleShowImportModal}
            >
              <IconPlus stroke={1.75} className="h-5 w-5" />
              Import
            </Button>
            <Button
              title="Add Folder"
              icon
              // onClick={toggleAddFolderModal}
            >
              <IconFolderPlus stroke={1.75} className="h-5 w-5" />
            </Button>

            <Button
              icon
              title="Toggle Reorder Mode"
              toggle={explorerReorderMode}
              onClick={toggleExplorerReorderMode}
            >
              <IconSwitchVertical stroke={1.75} className="h-5 w-5" />
            </Button>
          </div>

          <TimetablesTree />

          <PersonalTimetable />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
