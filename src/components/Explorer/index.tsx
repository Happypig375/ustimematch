import { IconFolderPlus, IconPlus, IconSwitchVertical } from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import ImportModal from "@components/Form/ImportModal";
import Button from "@ui/Button";
import { explorerVariants } from "@ui/variants";
import { actions, useTrackedStore } from "@store/index";
import { type Timetable, type TimetableConfig } from "../../types/timetable";
import PersonalTimetable from "./PersonalTimetable";
import TimetablesTree from "./TimetablesTree";

const Explorer = () => {
  const showExplorer = useTrackedStore().ui.showExplorer();
  const explorerReorderMode = useTrackedStore().ui.explorerReorderMode();
  const toggleExplorerReorderMode = actions.ui.toggleExplorerReorderMode;

  const [open, setOpen] = useState(false);
  const [tmpEditTb, setTmpEditTb] = useState<Timetable>();
  const [tmpEditTbCf, setTmpEditTbCf] = useState<TimetableConfig>();

  const addTimetable = actions.timetable.addTimetable;
  const deleteTimetable = actions.timetable.deleteTimetable;
  const editTimetable = actions.timetable.editTimetable;

  const onDelete = useCallback(() => {
    tmpEditTbCf && deleteTimetable(tmpEditTbCf?.id);
  }, [deleteTimetable, tmpEditTbCf]);

  const onAdd = useCallback(
    (timetable: Timetable, config: TimetableConfig) => {
      addTimetable(timetable, config);
    },
    [addTimetable],
  );

  const onEdit = useCallback(
    (timetable: Timetable, config: TimetableConfig) => {
      editTimetable(timetable, config);
    },
    [editTimetable],
  );

  // For resetting edit modal to import modal
  useEffect(() => {
    if (open) return;
    setTmpEditTb(undefined);
    setTmpEditTbCf(undefined);
  }, [open]);

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
            <Button fullWidth title="Import" onClick={() => setOpen(true)}>
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

          <TimetablesTree
            onClick={(timetable, timetableConfig) => {
              setOpen(true);
              setTmpEditTb(timetable);
              setTmpEditTbCf(timetableConfig);
            }}
            onEyeClick={(timetable, timetableConfig) => {
              editTimetable(timetable, {
                ...timetableConfig,
                visible: !timetableConfig.visible,
              });
            }}
          />

          <PersonalTimetable />

          <ImportModal
            open={open}
            setOpen={setOpen}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            timetable={tmpEditTb}
            timetableConfig={tmpEditTbCf}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explorer;
