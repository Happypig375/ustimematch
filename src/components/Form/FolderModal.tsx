import { DialogClose } from "@radix-ui/react-dialog";
import {
  IconDownload,
  IconFolderPlus,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  AlertAction,
  AlertCancel,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "@ui/Alert";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { Modal, ModalContent, ModalControl, ModalTitle } from "@ui/Modal";
import type { FolderItem } from "../../types/tree";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd?: (name: string) => void;

  folder?: FolderItem;
  onEdit?: (name: string) => void;
  onDelete?: () => void;
}

export interface FolderForm {
  name: string;
}

const FolderModal = ({
  open,
  setOpen,
  onAdd,
  onDelete,
  folder,
  onEdit,
}: Props) => {
  const defaultValues = useMemo<FolderForm>(
    () => ({
      name: folder?.name || "",
    }),
    // open is included for randomizing color on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [folder, open],
  );

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FolderForm>({
    defaultValues,
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (open) reset(defaultValues);
  }, [defaultValues, open, reset]);

  const onSubmit: SubmitHandler<FolderForm> = ({ name }) => {
    folder && onEdit && onEdit(name);
    onAdd && onAdd(name);
    setOpen(false);
  };

  // Delete alert
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent open={open} onOpenChange={setOpen}>
        <ModalTitle>{folder ? "Edit" : "Add"} Folder</ModalTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Name"
              labelId="name"
              error={errors.name?.message}
              {...register("name", {
                required: "Please enter a name",
                maxLength: { value: 40, message: "Folder's name is too long" },
              })}
            />
          </div>

          <ModalControl>
            <Alert open={openAlert} onOpenChange={setOpenAlert}>
              <AlertTrigger asChild>
                <Button
                  icon
                  type="button"
                  error
                  onClick={() => setOpenAlert(true)}
                  className={clsx(!folder && "hidden")}
                >
                  <IconTrash stroke={1.75} className="h-5 w-5" />
                </Button>
              </AlertTrigger>

              <AlertContent open={openAlert}>
                <AlertTitle>Are you sure?</AlertTitle>

                <AlertDescription>
                  You are deleteing the folder named <b>{folder?.name}</b> and{" "}
                  <b>all its contents</b>, this action cannot be undone.
                </AlertDescription>

                <div className="flex gap-2">
                  <AlertCancel asChild>
                    <Button fullWidth>Cancel</Button>
                  </AlertCancel>

                  {/* BUG: Unmounting modal will cancel alert animation */}
                  <AlertAction asChild>
                    <Button
                      error
                      fullWidth
                      onClick={() => {
                        // FIX: Wait for alert modal animation (200ms comes from variants)
                        setTimeout(() => {
                          onDelete && onDelete();
                          setOpen(false);
                        }, 200);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertAction>
                </div>
              </AlertContent>
            </Alert>

            <DialogClose asChild>
              <Button fullWidth type="button">
                <IconX stroke={1.75} className="h-5 w-5" />
                Cancel
              </Button>
            </DialogClose>

            <Button fullWidth type="submit">
              {folder ? (
                <>
                  <IconPencil stroke={1.75} className="h-5 w-5" />
                  Edit
                </>
              ) : (
                <>
                  <IconPlus stroke={1.75} className="h-5 w-5" />
                  Add
                </>
              )}
            </Button>
          </ModalControl>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default FolderModal;
