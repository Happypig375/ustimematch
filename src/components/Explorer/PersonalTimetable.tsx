import { IconEdit, IconEye, IconEyeOff, IconUserPlus } from "@tabler/icons";
import clsx from "clsx";
import { useCallback, useState } from "react";
import PersonalTimetableModal from "@components/Form/ImportModal";
import Button from "@ui/Button";
import { actions, useStore as useTrackedStore } from "@store/index";
import { type TimetableConfig, type Timetable } from "../../types/timetable";
import ColorChip from "./ColorChip";

const PersonalTimetable = () => {
  const personalTimetable = useTrackedStore().timetable.personalTimetable();
  const setPersonalTimetable = actions.timetable.setPersonalTimetable;
  const personalTimetableConfig =
    useTrackedStore().timetable.personalTimetableConfig();
  const setPersonalTimetableConfig =
    actions.timetable.setPersonalTimetableConfig;

  const [open, setOpen] = useState(false);

  const onDelete = useCallback(() => {
    setPersonalTimetable(null);
    setPersonalTimetableConfig(null);
  }, [setPersonalTimetable, setPersonalTimetableConfig]);

  const onAdd = useCallback(
    (timetable: Timetable, config: TimetableConfig) => {
      setPersonalTimetable(timetable);
      setPersonalTimetableConfig(config);
    },
    [setPersonalTimetable, setPersonalTimetableConfig],
  );

  const onEdit = useCallback(
    (timetable: Timetable, config: TimetableConfig) => {
      setPersonalTimetable(timetable);
      setPersonalTimetableConfig(config);
    },
    [setPersonalTimetable, setPersonalTimetableConfig],
  );

  // Here uses hidden to hide, otherwise animation would get cancelled if the component is unmounted
  // TODO: Find a better way to do this
  return (
    <div className="border-t border-border-gray-100">
      {personalTimetable && personalTimetableConfig ? (
        <div className={clsx("flex gap-4", !personalTimetable && "hidden")}>
          <div className="flex flex-grow items-center gap-2 overflow-hidden pl-4">
            <ColorChip color={personalTimetableConfig.color} />
            <span title={personalTimetable.name} className="truncate">
              {personalTimetable.name}
            </span>
          </div>

          <div className="flex gap-2 py-2 pr-4">
            <Button
              icon
              title="Toggle personal timetable visibility"
              onClick={() =>
                personalTimetableConfig &&
                setPersonalTimetableConfig({
                  ...personalTimetableConfig,
                  visible: !personalTimetableConfig.visible,
                })
              }
            >
              {personalTimetableConfig?.visible ? (
                <IconEye stroke={1.75} className="h-5 w-5" />
              ) : (
                <IconEyeOff stroke={1.75} className="h-5 w-5" />
              )}
            </Button>

            <Button
              icon
              title="Edit personal timetable"
              onClick={() => setOpen(true)}
            >
              <IconEdit stroke={1.75} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className={clsx("py-2 px-4", personalTimetable && "hidden")}>
          <Button
            fullWidth
            title="Add personal timetable"
            onClick={() => setOpen(true)}
          >
            <IconUserPlus stroke={1.75} className="h-5 w-5" />
            Personal Timetable
          </Button>
        </div>
      )}

      <PersonalTimetableModal
        personal
        open={open}
        setOpen={setOpen}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        timetable={personalTimetable || undefined}
        timetableConfig={personalTimetableConfig || undefined}
      />
    </div>
  );
};

export default PersonalTimetable;
