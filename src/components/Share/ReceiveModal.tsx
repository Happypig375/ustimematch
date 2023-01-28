import { IconDownload, IconListCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
} from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import { actions, useTrackedStore } from "@store/index";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import SelectItem from "./SelectItem";

const ReceiveModal = () => {
  const router = useRouter();
  const { share } = router.query;

  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [sharedTimetables, setSharedTimetables] = useState<Timetable[]>([]);

  useEffect(() => {
    if (typeof share === "string") setOpenReceiveModal(true);
  }, [share]);

  const { isFetching, isSuccess, isError } = trpc.share.getTimetables.useQuery(
    { slug: share as string },
    {
      enabled: typeof share === "string",
      onSuccess: ({ timetables }) => {
        setSharedTimetables(timetables);
      },
      onSettled: () => {
        setCheckedIds([]);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const onCheckedChange = (id: string, checked: boolean) => {
    if (checked) setCheckedIds([...checkedIds, id]);
    else setCheckedIds((prev) => prev.filter((i) => i !== id));
  };

  const checked = (id: string) => checkedIds.includes(id);

  const checkedAll = checkedIds.length === sharedTimetables.length;

  const toggleCheckAll = () => {
    if (checkedAll) setCheckedIds([]);
    else setCheckedIds(sharedTimetables.map((t) => t.config.id));
  };

  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();
  const addTimetable = actions.timetable.addTimetable;

  const saveSharedTiemtables = () => {
    sharedTimetables
      .filter((timetable) => checked(timetable.config.id))
      .forEach((timetable) => addTimetable(timetable));
    router.replace("/");
  };

  const controlledSetOpenReceiveModal: typeof setOpenReceiveModal = (state) => {
    if (isFetching) return;
    setOpenReceiveModal(state);
    router.replace("/");
  };

  return (
    <Modal open={openReceiveModal} onOpenChange={controlledSetOpenReceiveModal}>
      <ModalContent
        open={openReceiveModal}
        onOpenChange={controlledSetOpenReceiveModal}
      >
        <div className="flex justify-between">
          <ModalTitle>Shared Timetables</ModalTitle>
          {isSuccess && (
            <span className="text-sm">
              {checkedIds.length} / {sharedTimetables.length} Selected
            </span>
          )}
        </div>

        {isFetching && (
          <div className="grid h-64 place-items-center">
            <Spinner />
          </div>
        )}

        {isError && (
          <span className="grid h-64 place-items-center text-red-500">
            The shared link might be expired or invalid.
          </span>
        )}

        {isSuccess && (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
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
        )}

        <ModalControl>
          <Button
            title={checkedAll ? "Unselect All" : "Select All"}
            icon
            onClick={toggleCheckAll}
            disabled={!isSuccess}
          >
            <IconListCheck strokeWidth={1.75} className="h-5 w-5" />
          </Button>

          <ModalClose asChild>
            <Button fullWidth disabled={isFetching}>
              <IconX strokeWidth={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>

          <ModalClose asChild>
            <Button
              fullWidth
              onClick={saveSharedTiemtables}
              disabled={checkedIds.length === 0 || !isSuccess}
            >
              <IconDownload strokeWidth={1.75} className="h-5 w-5" />
              Save
            </Button>
          </ModalClose>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveModal;
