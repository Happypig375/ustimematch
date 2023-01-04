import { DialogClose } from "@radix-ui/react-dialog";
import { IconDownload, IconTrash, IconX } from "@tabler/icons";
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
import { trpc } from "@utils/trpc";
import type { Timetable, TimetableConfig } from "../../types/timetable";
import { ColorInput } from "./ColorInput";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  personal?: boolean;
  onAdd: (timetable: Timetable, config: TimetableConfig) => void;
  onDelete?: () => void;
  onEdit?: (timetable: Timetable, config: TimetableConfig) => void;
  // If these two fields are passed, it means the modal is in edit mode
  timetable?: Timetable;
  timetableConfig?: TimetableConfig;
}

export interface PersonalTimetableForm
  extends Omit<Timetable, "lessons" | "modifications"> {
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
  timetableConfig,
}: Props) => {
  const defaultValues = useMemo<PersonalTimetableForm>(
    () => ({
      university: "HKUST",
      name: timetable?.name || "",
      plannerURL: timetable?.plannerURL || "",
      color:
        timetableConfig?.color ||
        // https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
        // Consider using hsl then convert to hex to generate more pelasing colors
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    }),
    // open is included for randomizing color on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timetable, timetableConfig, open],
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
        };
        const tempConfig = {
          id: timetable && timetableConfig ? timetableConfig.id : nanoid(),
          color: getValues("color"),
          visible: timetableConfig ? timetableConfig.visible : true,
        };

        timetable && timetableConfig
          ? onEdit && onEdit(tmpTimetable, tempConfig)
          : onAdd(tmpTimetable, tempConfig);

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
          {timetable && timetableConfig ? "Edit" : "Import"}{" "}
          {personal && "Personal"} Timetable
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
              <IconDownload stroke={1.75} className="h-5 w-5" />
              Save
            </Button>
          </ModalControl>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ImportPersonalModal;
