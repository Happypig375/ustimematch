import Button from "@ui/Button";
import { useStore } from "../../store";
import {
  ShareIcon,
  FolderPlusIcon,
  SquaresPlusIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import PersonalTimetable from "./PersonalTimetable";
import TimetablesTree from "./TimetablesTree";
import { explorerVariants } from "@ui/variants";

const Explorer = () => {
  const showExplorer = useStore.use.showExplorer();
  const personalTimetable = useStore.use.personalTimetable();
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
          className="flex h-full w-[clamp(256px,20%,512px)] flex-col border-r border-border-gray-100"
        >
          {/* Buttons */}
          <div className="flex gap-2 border-b border-border-gray-100 px-4 py-2">
            <Button
              fullWidth
              title="Import"
              // onClick={toggleShowImportModal}
            >
              <SquaresPlusIcon className="h-5 w-5" />
              Import
            </Button>
            <Button
              title="Add Folder"
              icon
              // onClick={toggleAddFolderModal}
            >
              <FolderPlusIcon className="h-5 w-5" />
            </Button>

            <Button
              icon
              title="Toggle Reorder Mode"
              toggle={explorerReorderMode}
              onClick={toggleExplorerReorderMode}
            >
              <ArrowsUpDownIcon className="h-5 w-5" />
            </Button>
          </div>

          <TimetablesTree />

          <PersonalTimetable timetable={personalTimetable} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
