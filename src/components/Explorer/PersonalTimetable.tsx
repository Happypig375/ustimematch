import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { useBoundStore } from "../../store";
import ColorChip from "./ColorChip";

const PersonalTimetable = () => {
  const personalTimetable = useBoundStore.use.personalTimetable();

  return (
    <div className="border-t border-border-gray-100 py-2 px-4">
      {personalTimetable ? (
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <ColorChip color="#003366" />
            <span
              // title={timetable.name}
              className="truncate"
            >
              {/* {timetable.name} */}
              Testitems-centeritems-centeritems-center
            </span>
          </div>

          <div className="flex gap-2">
            <Button icon>
              <EyeIcon className="h-5 w-5" />
              {/* <EyeSlashIcon className="h-5 w-5" /> */}
            </Button>

            <Button icon>
              <PencilSquareIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <Button fullWidth matchIconPadding>
          <UserPlusIcon className="h-5 w-5" />
          Personal Timetable
        </Button>
      )}
    </div>
  );
};

export default PersonalTimetable;
