import { IconEdit, IconEye, IconEyeOff, IconUserPlus } from "@tabler/icons";
import { useCallback, useState } from "react";
import TimetableForm from "@components/Modal/TimetableForm";
import Button from "@components/ui/Button";
import { actions, useTrackedStore } from "@store/index";
import { type Timetable } from "../../types/timetable";
import ColorChip from "./ColorChip";

const PersonalTimetable = () => {
  const personalTimetable = useTrackedStore().timetable.personalTimetable();
  const setPersonalTimetable = actions.timetable.setPersonalTimetable;

  const [open, setOpen] = useState(false);

  const onDelete = useCallback(() => {
    setPersonalTimetable(null);
  }, [setPersonalTimetable]);

  const onAdd = useCallback(
    (timetable: Timetable) => {
      setPersonalTimetable(timetable);
    },
    [setPersonalTimetable],
  );

  const onEdit = useCallback(
    (timetable: Timetable) => {
      setPersonalTimetable(timetable);
    },
    [setPersonalTimetable],
  );

  return (
    <div className="border-t border-border-100">
      {personalTimetable ? (
        <div className="flex gap-4">
          <div className="flex flex-grow items-center gap-2 overflow-hidden pl-4 text-fg-100">
            <ColorChip color={personalTimetable.config.color} />
            <span title={personalTimetable.name} className="truncate">
              {personalTimetable.name}
            </span>
          </div>

          <div className="flex gap-2 py-2 pr-2">
            <Button
              icon
              title="Toggle personal timetable visibility"
              onClick={() =>
                personalTimetable &&
                setPersonalTimetable({
                  ...personalTimetable,
                  config: {
                    ...personalTimetable.config,
                    visible: !personalTimetable.config.visible,
                  },
                })
              }
            >
              {personalTimetable.config.visible ? (
                <IconEye stroke={1.75} className="h-5 w-5" />
              ) : (
                <IconEyeOff stroke={1.75} className="h-5 w-5" />
              )}
            </Button>

            <Button
              icon
              title="Edit personal timetable"
              onClick={() => setOpen(true)}
              data-cy="edit-personal-timetable"
            >
              <IconEdit stroke={1.75} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <Button
            fullWidth
            title="Add personal timetable"
            onClick={() => setOpen(true)}
            data-cy="add-personal-timetable"
          >
            <IconUserPlus stroke={1.75} className="h-5 w-5" />
            Personal Timetable
          </Button>
        </div>
      )}

      <TimetableForm
        personal
        open={open}
        setOpen={setOpen}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        timetable={personalTimetable || undefined}
      />
    </div>
  );
};

export default PersonalTimetable;
