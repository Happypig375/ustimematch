import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { type Timetable } from "../../types/timetable";
import ColorChip from "./ColorChip";
import PersonalTimetableModal from "../Form/PersonalTimetableModal";

interface Props {
  timetable: Timetable | null;
}

const PersonalTimetable = ({ timetable }: Props) => {
  return (
    <>
      <div className="border-t border-border-gray-100">
        {timetable ? (
          <div className="flex gap-4">
            <div className="flex items-center gap-2 overflow-hidden pl-4">
              <ColorChip color="#89f43e" />
              <span
                // title={timetable.name}
                className="truncate"
              >
                {/* {timetable.name} */}
                Testitems-centeritems-centeritems-center
              </span>
            </div>

            <div className="flex gap-2 py-2 pr-4">
              <Button icon title="Toggle personal timetable visibility">
                <EyeIcon className="h-5 w-5" />
                {/* <EyeSlashIcon className="h-5 w-5" /> */}
              </Button>

              <Button icon title="Edit personal timetable">
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-2 px-4">
            <PersonalTimetableModal />
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalTimetable;
