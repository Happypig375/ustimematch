import { IconCalendarPlus, IconFolderPlus } from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import SortableTree from "@components/Explorer/SortableTree";
import FolderModal from "@components/Modal/FolderForm";
import ImportModal from "@components/Modal/TimetableForm";
import Button from "@ui/Button";
import { explorerVariants } from "@ui/variants";
import { actions, useTrackedStore } from "@store/index";
import { type Timetable } from "../../types/timetable";
import PersonalTimetable from "./PersonalTimetable";

const Explorer = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();

  const [openImportModal, setOpenImportModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);

  const addTimetable = actions.timetable.addTimetable;
  const addFolder = actions.timetable.addFolder;

  const onAddTimetable = useCallback(
    (timetable: Timetable) => {
      addTimetable(timetable);
    },
    [addTimetable],
  );

  const onAddFolder = useCallback(
    (name: string) => {
      addFolder(name);
    },
    [addFolder],
  );

  return (
    <AnimatePresence initial={false}>
      {showExplorer && (
        <motion.div
          exit="close"
          animate="open"
          initial="close"
          variants={explorerVariants}
          className="flex h-full w-[clamp(256px,20%,512px)] flex-shrink-0 flex-col border-r border-border-gray-100"
        >
          {/* Buttons */}
          <div className="flex gap-2 border-b border-border-gray-100 px-4 py-2">
            <Button
              fullWidth
              title="Import"
              onClick={() => setOpenImportModal(true)}
            >
              <IconCalendarPlus stroke={1.75} className="h-5 w-5" />
              Timetable
            </Button>
            <Button
              title="Add Folder"
              icon
              onClick={() => setOpenFolderModal(true)}
            >
              <IconFolderPlus stroke={1.75} className="h-5 w-5" />
            </Button>
          </div>

          <SortableTree />

          <PersonalTimetable />

          <ImportModal
            open={openImportModal}
            setOpen={setOpenImportModal}
            onAdd={onAddTimetable}
          />

          <FolderModal
            onAdd={onAddFolder}
            open={openFolderModal}
            setOpen={setOpenFolderModal}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
