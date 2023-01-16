import { IconDownload, IconListCheck, IconX } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@components/ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
} from "@components/ui/Modal";
import { actions, useTrackedStore } from "@store/index";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import SelectItem from "./SelectItem";

// import SelectItem from "./TimetableItem";

const ReceiveModal = () => {
  const router = useRouter();
  const { share } = router.query;

  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  const [sharedTimetables, setSharedTimetables] = useState<Timetable[]>([]);

  const { isLoading, isSuccess, isError } = trpc.share.getTimetables.useQuery(
    { slug: share as string },
    {
      enabled: typeof share === "string",
      onSuccess: ({ timetables }) => {
        router.push("/");
        setCheckedIds([]);
        setSharedTimetables(timetables);
        setOpenReceiveModal(true);
      },
      onError: () => {
        toast.error("The shared link might be invalid or has already expired");
      },
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const onCheckedChange = (id: string, checked: boolean) => {
    if (checked) setCheckedIds([...checkedIds, id]);
    else setCheckedIds((prev) => prev.filter((i) => i !== id));
  };

  const checked = (id: string) => checkedIds.includes(id);

  const toggleCheckAll = () => {
    if (checkedIds.length === sharedTimetables.length) setCheckedIds([]);
    else setCheckedIds(sharedTimetables.map((t) => t.config.id));
  };

  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();
  const addTimetable = actions.timetable.addTimetable;

  const saveSharedTiemtables = () => {
    sharedTimetables
      .filter((timetable) => checked(timetable.config.id))
      .forEach((timetable) => addTimetable(timetable));
  };

  return (
    <Modal open={openReceiveModal} onOpenChange={setOpenReceiveModal}>
      <ModalContent open={openReceiveModal} onOpenChange={setOpenReceiveModal}>
        <div className="flex justify-between">
          <ModalTitle>Shared Timetables</ModalTitle>
          <span className="text-sm">
            {checkedIds.length} / {sharedTimetables.length} Selected
          </span>
        </div>

        <div className="flex max-h-[336px] flex-col gap-1 overflow-y-auto">
          {sharedTimetables.map((timetable) => (
            <SelectItem
              duplicateWarning={combinedTimetables.some(
                ({ name }) => name === timetable.name,
              )}
              key={timetable.config.id}
              id={timetable.config.id}
              timetable={timetable}
              checked={checked(timetable.config.id)}
              onCheckedChange={(checked) =>
                onCheckedChange(timetable.config.id, checked)
              }
            />
          ))}
        </div>

        <ModalControl>
          <Button icon onClick={toggleCheckAll}>
            <IconListCheck stroke={1.75} className="h-5 w-5" />
          </Button>

          <ModalClose asChild>
            <Button fullWidth>
              <IconX stroke={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>

          <ModalClose asChild>
            <Button
              fullWidth
              onClick={saveSharedTiemtables}
              disabled={checkedIds.length === 0}
            >
              <IconDownload stroke={1.75} className="h-5 w-5" />
              Save
            </Button>
          </ModalClose>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveModal;
