import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
} from "@components/ui/Modal";
import type { FolderItem } from "../../types/tree";
import DeleteAlert from "./DeleteAlert";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;

  // Add mode
  onAdd?: (name: string) => void;

  // Edit mode
  folder?: FolderItem;
  onEdit?: (name: string) => void;
  onDelete?: () => void;
}

const ZFolderForm = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter a name" })
    .max(40, { message: "The name is too long" }),
});

type IFolderForm = z.infer<typeof ZFolderForm>;

const FolderForm = ({
  open,
  setOpen,
  onAdd,
  folder,
  onEdit,
  onDelete,
}: Props) => {
  const defaultValues = useMemo<IFolderForm>(
    () => ({
      name: folder?.name || "",
    }),
    [folder],
  );

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFolderForm>({
    defaultValues,
    resolver: zodResolver(ZFolderForm),
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (open) reset(defaultValues);
  }, [defaultValues, open, reset]);

  const onSubmit: SubmitHandler<IFolderForm> = ({ name }) => {
    folder && onEdit && onEdit(name);
    onAdd && onAdd(name);
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent open={open} onOpenChange={setOpen}>
        <ModalTitle>{folder ? "Edit" : "Add"} Folder</ModalTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          data-cy="folder-form"
        >
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              label="Name"
              inputMode="text"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <ModalControl>
            <DeleteAlert
              hidden={!folder}
              onDelete={() => {
                onDelete && onDelete();
                setOpen(false);
              }}
            >
              You are deleteing the folder named <b>{folder?.name}</b> and{" "}
              <b>all its contents</b>, this action cannot be undone.
            </DeleteAlert>

            <ModalClose asChild>
              <Button fullWidth type="button">
                <IconX strokeWidth={1.75} className="h-5 w-5" />
                Cancel
              </Button>
            </ModalClose>

            <Button fullWidth type="submit">
              {folder ? (
                <>
                  <IconPencil strokeWidth={1.75} className="h-5 w-5" />
                  Edit
                </>
              ) : (
                <>
                  <IconPlus strokeWidth={1.75} className="h-5 w-5" />
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

export default FolderForm;
