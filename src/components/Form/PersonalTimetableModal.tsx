import { DialogClose } from "@radix-ui/react-dialog";
import {
  IconDownload,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconX,
} from "@tabler/icons";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import {
  Modal,
  ModalContent,
  ModalControl,
  ModalTitle,
  ModalTrigger,
} from "@ui/Modal";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import { ColorInput } from "./ColorInput";

interface Props {
  timetable?: Timetable;
  onAdd: (timetable: Timetable) => void;
  onDelete?: () => void;
}

export type PersonalTimetableForm = Omit<
  Timetable,
  "lessons" | "modifications"
>;

/**
 * Default import university is now HKUST, support for other universities will be added later
 */
const ImportPersonalModal = ({ timetable, onAdd, onDelete }: Props) => {
  const [open, setOpen] = useState(false);

  const defaultValues = useMemo<PersonalTimetableForm>(
    () => ({
      university: "HKUST",
      name: timetable?.name || "",
      plannerURL: timetable?.plannerURL || "",
      color:
        timetable?.color ||
        // https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
        // Consider using hsl then convert to hex to generate more pelasing colors
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    }),
    [timetable],
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

  const { error, isFetching, refetch } = trpc.ical.getUSTLessons.useQuery(
    { plannerURL },
    {
      retry: false,
      enabled: false,
      onSuccess: ({ lessons }) => {
        // Known issue: Using setState will cause animation to fail
        onAdd({
          lessons,
          plannerURL,
          name: getValues("name"),
          color: getValues("color"),
          university: getValues("university"),
        });

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

  const controlledSetOpen: Dispatch<SetStateAction<boolean>> = (v) =>
    !isFetching && setOpen(v);

  return (
    <Modal open={open} onOpenChange={controlledSetOpen}>
      <ModalTrigger asChild>
        {timetable ? (
          <Button icon title="Edit personal timetable">
            <IconEdit stroke={1.75} className="h-5 w-5" />
          </Button>
        ) : (
          <Button fullWidth title="Add personal timetable">
            <IconUserPlus stroke={1.75} className="h-5 w-5" />
            Personal Timetable
          </Button>
        )}
      </ModalTrigger>

      <ModalContent open={open} onOpenChange={controlledSetOpen}>
        <ModalTitle>
          {timetable ? "Edit" : "Import"} Personal Timetable
        </ModalTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 mb-8 flex flex-col gap-2">
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
            {timetable && (
              <Alert open={openAlert} onOpenChange={setOpenAlert}>
                <AlertTrigger asChild>
                  <Button
                    icon
                    type="button"
                    error
                    onClick={() => setOpenAlert(true)}
                    disabled={isFetching}
                  >
                    <IconTrash stroke={1.75} className="h-5 w-5" />
                  </Button>
                </AlertTrigger>

                <AlertContent open={openAlert} onOpenChange={setOpenAlert}>
                  <div className="flex flex-col gap-4">
                    <AlertTitle>Are you sure?</AlertTitle>

                    <AlertDescription>
                      You are deleteing your personal timetable, this action
                      cannot be undone.
                    </AlertDescription>

                    <div className="flex gap-2">
                      <AlertCancel asChild>
                        <Button fullWidth>Cancel</Button>
                      </AlertCancel>

                      {/* Known issue: This will close two modals at the same time and cause animation to fail */}
                      <AlertAction asChild>
                        <Button error fullWidth onClick={onDelete}>
                          Delete
                        </Button>
                      </AlertAction>
                    </div>
                  </div>
                </AlertContent>
              </Alert>
            )}

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
