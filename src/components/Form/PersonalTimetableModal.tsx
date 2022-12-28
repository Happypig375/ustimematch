import {
  ArrowDownTrayIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import Button from "@ui/Button";
import {
  Modal,
  ModalContent,
  ModalControl,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from "@ui/Modal";
import { useState } from "react";

const ImportPersonalModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button fullWidth>
          <UserPlusIcon className="h-5 w-5" />
          Personal Timetable
        </Button>
      </ModalTrigger>

      <ModalContent open={open} onOpenChange={setOpen}>
        <ModalTitle>Import Personal Timetable</ModalTitle>
        <ModalDescription>Description</ModalDescription>

        <div>Real Content</div>

        <ModalControl>
          <DialogClose asChild>
            <Button fullWidth>
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button fullWidth>
              <ArrowDownTrayIcon className="h-5 w-5" />
              Save
            </Button>
          </DialogClose>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default ImportPersonalModal;
