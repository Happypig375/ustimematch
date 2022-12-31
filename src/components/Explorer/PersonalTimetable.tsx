import { IconEye, IconEyeOff } from "@tabler/icons";
import clsx from "clsx";
import { useCallback } from "react";
import PersonalTimetableModal from "@components/Form/PersonalTimetableModal";
import Button from "@ui/Button";
import { useStore } from "@store/index";
import { type Timetable } from "../../types/timetable";
import ColorChip from "./ColorChip";

const PersonalTimetable = () => {
  const personalTimetable = useStore.use.personalTimetable();
  const personalTimetableConfig = useStore.use.personalTimetableConfig();
  const togglePersonalTimetableVisible =
    useStore.use.togglePersonalTimetableVisible();
  const setPersonalTimetable = useStore.use.setPersonalTimetable();

  const onDelete = useCallback(() => {
    setPersonalTimetable(null);
  }, [setPersonalTimetable]);

  const onAdd = useCallback(
    (timetable: Timetable) => {
      setPersonalTimetable(timetable);
    },
    [setPersonalTimetable],
  );

  // Here uses hidden to hide, otherwise animation would get cancelled if the component is unmounted
  // TODO: Find a better way to do this
  return (
    <div className="border-t border-border-gray-100">
      <div className={clsx("flex gap-4", !personalTimetable && "hidden")}>
        {personalTimetable && (
          <div className="flex flex-grow items-center gap-2 overflow-hidden pl-4">
            <ColorChip color={personalTimetable.color} />
            <span title={personalTimetable.name} className="truncate">
              {personalTimetable.name}
            </span>
          </div>
        )}

        <div className="flex gap-2 py-2 pr-4">
          <Button
            icon
            title="Toggle personal timetable visibility"
            onClick={togglePersonalTimetableVisible}
          >
            {personalTimetableConfig.visible ? (
              <IconEye stroke={1.75} className="h-5 w-5" />
            ) : (
              <IconEyeOff stroke={1.75} className="h-5 w-5" />
            )}
          </Button>

          <PersonalTimetableModal
            onAdd={onAdd}
            onDelete={onDelete}
            timetable={personalTimetable ? personalTimetable : undefined}
          />
        </div>
      </div>

      <div className={clsx("py-2 px-4", personalTimetable && "hidden")}>
        <PersonalTimetableModal onAdd={onAdd} />
      </div>
    </div>
  );
};

export default PersonalTimetable;
