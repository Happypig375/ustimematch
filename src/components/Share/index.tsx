import {
  IconCheck,
  IconClipboard,
  IconClipboardCheck,
  IconCopy,
  IconShare,
  IconX,
} from "@tabler/icons";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import Button from "@ui/Button";
import Input from "@ui/Input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
  ModalTrigger,
} from "@ui/Modal";
import { useTrackedStore } from "@store/index";
import TimetableItem from "./TimetableItem";

const Share = () => {
  const [openShareModal, setOpenShareModal] = useState(false);

  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const onCheckedChange = (id: string, checked: boolean) => {
    if (checked) setCheckedIds([...checkedIds, id]);
    else setCheckedIds((prev) => prev.filter((i) => i !== id));
  };

  const checked = (id: string) => checkedIds.includes(id);

  useEffect(() => {
    if (openShareModal) setCheckedIds([]);
  }, [openShareModal]);

  return (
    <Modal open={openShareModal} onOpenChange={setOpenShareModal}>
      <ModalTrigger asChild>
        <Button icon title="Refresh" onClick={() => setOpenShareModal(true)}>
          <IconShare stroke={1.75} className="h-5 w-5" />
        </Button>
      </ModalTrigger>

      <ModalContent open={openShareModal} onOpenChange={setOpenShareModal}>
        <ModalTitle>Share</ModalTitle>

        <div className="flex flex-col">
          {combinedTimetables.map((timetable) => (
            <TimetableItem
              key={timetable.config.id}
              timetable={timetable}
              checked={checked(timetable.config.id)}
              onCheckedChange={(checked) =>
                onCheckedChange(timetable.config.id, checked)
              }
            />
          ))}

          {combinedTimetables.length === 0 && (
            <span className="text-center text-sm">
              Add some timetables first!
            </span>
          )}
        </div>

        {/* <div className="flex flex-col gap-2">
          <QRCodeSVG
            // includeMargin
            value="testasdfffffasdffffffffffffffffffasdfffffffff"
            // className="h-64 w-64 self-center rounded-xl"
            className="h-64 w-64 self-center p-4"
          />

          <div className="flex gap-2">
            <Input
              readOnly
              value="https://www.ustimematch.com/share/123"
              className="flex-grow"
              // onClick={selectUrl}
              // ref={readOnlyInputRef}
              // className="bg-bg-light-3 flex-grow rounded-md px-3"
            />
            <Button title="Copy share link" icon>
              {true ? (
                <IconCopy stroke={1.75} className="h-5 w-5" />
              ) : (
                <IconCheck stroke={1.75} className="h-5 w-5 text-emerald-500" />
              )}
            </Button>
          </div>
        </div> */}

        <ModalControl>
          <ModalClose asChild>
            <Button fullWidth>
              <IconX stroke={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>

          {combinedTimetables.length !== 0 && (
            <Button fullWidth>
              <IconCheck stroke={1.75} className="h-5 w-5" />
              Confirm
            </Button>
          )}
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default Share;
