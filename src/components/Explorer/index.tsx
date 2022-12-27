import Button from "@ui/Button";
import { useBoundStore } from "../../store";
import {
  ShareIcon,
  FolderPlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import PersonalTimetable from "./PersonalTimetable";
import TimetablesTree from "./TimetablesTree";

const explorerVariants: Variants = {
  open: {
    marginLeft: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  close: {
    // Matching tailwind's "min-w-[256px] w-1/5"
    marginLeft: "min(-256px, -20%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

const Explorer = () => {
  const showExplorer = useBoundStore.use.showExplorer();

  return (
    <AnimatePresence initial={false}>
      {showExplorer && (
        <motion.div
          exit="close"
          animate="open"
          initial="close"
          variants={explorerVariants}
          className="flex h-full w-1/5 min-w-[256px] flex-col border-r border-border-gray-100"
        >
          {/* Buttons */}
          <div className="flex gap-2 border-b border-border-gray-100 px-4 py-2">
            <Button
              fullWidth
              fullHeight
              title="Import"
              // onClick={toggleShowImportModal}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Import
            </Button>
            <Button
              title="Add Folder"
              icon
              // onClick={toggleAddFolderModal}
            >
              <FolderPlusIcon className="h-5 w-5" />
            </Button>
            <Button icon title="Share">
              <ShareIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-auto">
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
            <div>asdlfaj;sdf</div>
          </div>
          {/* <TimetablesTree /> */}

          <PersonalTimetable />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
