import { IconCalendarPlus, IconFolderPlus } from "@tabler/icons-react";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useState } from "react";
import FolderForm from "@components/Form/FolderForm";
import TimetableForm from "@components/Form/TimetableForm";
import Share from "@components/Share/ShareModal";
import Button from "@components/ui/Button";
import { explorerVariants } from "@components/ui/motion/variants";
import { actions, useTrackedStore } from "@store/index";
import { type Timetable } from "../../types/timetable";
import PersonalTimetable from "./PersonalTimetable";
import SortableTree from "./SortableTree";

const AddTimetable = () => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const addTimetable = actions.timetable.addTimetable;

  const onAddTimetable = useCallback(
    (timetable: Timetable) => {
      addTimetable(timetable);
    },
    [addTimetable],
  );

  return (
    <>
      <Button
        fullWidth
        title="Add Timetable"
        onClick={() => setOpenImportModal(true)}
        data-cy="add-timetable"
      >
        <IconCalendarPlus strokeWidth={1.75} className="h-5 w-5" />
        Timetable
      </Button>
      <TimetableForm
        open={openImportModal}
        setOpen={setOpenImportModal}
        onAdd={onAddTimetable}
      />
    </>
  );
};

const AddFolder = () => {
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const addFolder = actions.timetable.addFolder;

  const onAddFolder = useCallback(
    (name: string) => {
      addFolder(name);
    },
    [addFolder],
  );

  return (
    <>
      <Button
        icon
        title="Add Folder"
        onClick={() => setOpenFolderModal(true)}
        data-cy="add-folder"
      >
        <IconFolderPlus strokeWidth={1.75} className="h-5 w-5" />
      </Button>
      <FolderForm
        onAdd={onAddFolder}
        open={openFolderModal}
        setOpen={setOpenFolderModal}
      />
    </>
  );
};

const Explorer = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();

  return (
    <AnimatePresence initial={false}>
      {showExplorer && (
        <m.div
          exit="close"
          animate="open"
          initial="close"
          variants={explorerVariants}
          className="flex h-full w-[clamp(256px,20%,512px)] flex-shrink-0 flex-col border-r border-border-100"
        >
          <div
            className="flex gap-2 border-b border-border-100 p-2"
            data-tour="explorer-controls"
          >
            <AddTimetable />
            <AddFolder />
            <Share />
          </div>

          <SortableTree />

          <PersonalTimetable />
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
