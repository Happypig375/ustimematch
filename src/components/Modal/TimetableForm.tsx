import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconPlus, IconX } from "@tabler/icons";
import { nanoid } from "nanoid";
import { useEffect, useMemo } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { z } from "zod";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
} from "@components/ui/Modal";
import { randomHex } from "@utils/randomHex";
import { trpc } from "@utils/trpc";
import { ZHKUSTTimetable, type Timetable } from "../../types/timetable";
import { ColorInput } from "./ColorInput";
import DeleteAlert from "./DeleteAlert";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;

  // Add mode
  onAdd?: (timetable: Timetable) => void;

  // Edit mode
  timetable?: Timetable;
  onDelete?: () => void;
  onEdit?: (timetable: Timetable) => void;

  // Personal timetable
  personal?: boolean;
}

const ZTimetableForm = ZHKUSTTimetable.pick({
  name: true,
  plannerURL: true,
}).merge(ZHKUSTTimetable.shape.config.pick({ color: true }));

export type ITimetableForm = z.infer<typeof ZTimetableForm>;

/**
 * Imports timetable by HKUST planner URL, might add other methods later.
 */
const TimetableForm = ({
  open,
  setOpen,
  onAdd,
  timetable,
  onDelete,
  onEdit,
  personal,
}: Props) => {
  const defaultValues = useMemo<ITimetableForm>(
    () => ({
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
  } = useForm<ITimetableForm>({
    defaultValues,
    resolver: zodResolver(ZTimetableForm),
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
        // Prevent callback is modal isn't open (will be trigger from refresh modal because query are the same)
        if (!open) return;

        const tmpTimetable: Timetable = {
          lessons,
          plannerURL,
          // Placeholder
          university: "HKUST",
          name: getValues("name").trim(),
          config: {
            id: timetable ? timetable.config.id : nanoid(),
            color: getValues("color"),
            visible: timetable ? timetable.config.visible : true,
          },
        };
        console.log(getValues("color"));
        timetable
          ? onEdit && onEdit(tmpTimetable)
          : onAdd && onAdd(tmpTimetable);

        setOpen(false);
      },
      onError: (err) => {
        // Prevent callback is modal isn't open (will be trigger from refresh modal because query are the same)
        if (!open) return;

        console.error(err);
        toast.error("Failed to import timetable, please check your URL.");
      },
    },
  );

  const onSubmit: SubmitHandler<ITimetableForm> = () => {
    refetch();
  };

  const controlledSetOpen: typeof setOpen = (v) => !isFetching && setOpen(v);

  return (
    <Modal open={open} onOpenChange={controlledSetOpen}>
      <ModalContent open={open} onOpenChange={controlledSetOpen}>
        <ModalTitle>
          {timetable ? "Edit" : "Add"} {personal && "Personal"} Timetable
        </ModalTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          data-cy="timetable-form"
        >
          <div className="flex flex-col gap-2">
            <Input
              inputMode="text"
              label="Name"
              labelId="name"
              disabled={isFetching}
              error={errors.name?.message}
              {...register("name")}
              data-cy="timetable-form-name-input"
            />
            <Input
              inputMode="url"
              labelId="planner-url"
              label="Timetable Planner URL"
              disabled={isFetching}
              error={errors.plannerURL?.message}
              {...register("plannerURL")}
              data-cy="timetable-form-planner-url-input"
            />
            <ColorInput name="color" control={control} disabled={isFetching} />
          </div>

          <ModalControl>
            <DeleteAlert
              enabled={!!timetable}
              onDelete={() => {
                onDelete && onDelete();
                setOpen(false);
              }}
            >
              You are deleteing{" "}
              <b>{personal ? "your personal" : `${timetable?.name}'s`}</b>{" "}
              timetable, this action cannot be undone.
            </DeleteAlert>

            <ModalClose asChild>
              <Button fullWidth type="button" disabled={isFetching}>
                <IconX stroke={1.75} className="h-5 w-5" />
                Cancel
              </Button>
            </ModalClose>

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

export default TimetableForm;
