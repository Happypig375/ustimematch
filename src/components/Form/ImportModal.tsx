import { DialogClose } from "@radix-ui/react-dialog";
import { IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
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
import { randomHex } from "@utils/randomHex";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import { ColorInput } from "./ColorInput";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  personal?: boolean;
  onAdd?: (timetable: Timetable) => void;
  onDelete?: () => void;
  onEdit?: (timetable: Timetable) => void;
  // If timetable prop is passed, it means the modal is in edit mode
  timetable?: Timetable;
}

export interface PersonalTimetableForm
  extends Omit<Timetable, "lessons" | "config"> {
  color: string;
}

/**
 * Default import university is now HKUST, support for other universities will be added later
 */
const ImportPersonalModal = ({
  open,
  setOpen,
  personal,
  onAdd,
  onDelete,
  onEdit,
  timetable,
}: Props) => {
  const defaultValues = useMemo<PersonalTimetableForm>(
    () => ({
      university: "HKUST",
      name: timetable?.name || "",
      plannerURL: timetable?.plannerURL || "",
      color: timetable?.config.color || randomHex(),
    }),
    // open is included for randomizing color on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timetable, open],
  );

  const {
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalTimetableForm>({
    defaultValues,
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset, defaultValues]);

  // Handle form submission
  const plannerURL = useWatch({ control, name: "plannerURL" });

  const { isFetching, refetch } = trpc.ical.getUSTLessons.useQuery(
    { plannerURL },
    {
      retry: false,
      enabled: false,
      onSuccess: ({ lessons }) => {
        const tmpTimetable = {
          lessons,
          plannerURL,
          name: getValues("name").trim(),
          university: getValues("university"),
          config: {
            id: timetable ? timetable.config.id : nanoid(),
            color: getValues("color"),
            visible: timetable ? timetable.config.visible : true,
          },
        };

        timetable
          ? onEdit && onEdit(tmpTimetable)
          : onAdd && onAdd(tmpTimetable);

        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to import timetable, please check your URL.");
      },
    },
  );

  const onSubmit: SubmitHandler<PersonalTimetableForm> = () => {
    refetch();
  };

  // Delete alert
  const [openAlert, setOpenAlert] = useState(false);

  const controlledSetOpen: typeof setOpen = (v) => !isFetching && setOpen(v);

  return (
    <Modal open={open} onOpenChange={controlledSetOpen}>
      <ModalContent open={open} onOpenChange={controlledSetOpen}>
        <ModalTitle>
          {timetable ? "Edit" : "Add"} {personal && "Personal"} Timetable
        </ModalTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              label="Name"
              labelId="name"
              disabled={isFetching}
              error={errors.name?.message}
              {...register("name", {
                required: "Please enter a name",
                maxLength: { value: 40, message: "Your name is too long" },
              })}
            />
            <Input
              type="url"
              labelId="planner-url"
              label="Timetable Planner URL"
              disabled={isFetching}
              error={errors.plannerURL?.message}
              {...register("plannerURL", {
                required: "Please enter an URL",
                pattern: {
                  value:
                    /^https:\/\/admlu65\.ust\.hk\/planner\/export\/.+\.ics$/,
                  message: "Please enter a correct URL",
                },
              })}
            />
            <ColorInput name="color" control={control} disabled={isFetching} />
          </div>

          <ModalControl>
            <Alert open={openAlert} onOpenChange={setOpenAlert}>
              <AlertTrigger asChild>
                <Button
                  icon
                  type="button"
                  error
                  onClick={() => setOpenAlert(true)}
                  disabled={isFetching}
                  className={clsx(!timetable && "hidden")}
                >
                  <IconTrash stroke={1.75} className="h-5 w-5" />
                </Button>
              </AlertTrigger>

              <AlertContent open={openAlert}>
                <AlertTitle>Are you sure?</AlertTitle>

                <AlertDescription>
                  You are deleteing{" "}
                  <b>{personal ? "your personal" : `${timetable?.name}'s`}</b>{" "}
                  timetable, this action cannot be undone.
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
              <Button fullWidth type="button" disabled={isFetching}>
                <IconX stroke={1.75} className="h-5 w-5" />
                Cancel
              </Button>
            </DialogClose>

            <Button
              fullWidth
              type="submit"
              loading={isFetching}
              disabled={isFetching}
            >
              {timetable ? (
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

export default ImportPersonalModal;
