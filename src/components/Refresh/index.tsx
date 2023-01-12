import { IconCheck, IconRefresh, IconX } from "@tabler/icons";
import { useEffect, useState } from "react";
import ColorChip from "@components/Explorer/ColorChip";
import Button from "@ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
  ModalTrigger,
} from "@ui/Modal";
import { actions, useTrackedStore } from "@store/index";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";

const TimetableStatus = ({
  personal,
  timetable,
}: {
  personal: boolean;
  timetable: Timetable;
}) => {
  const editTimetable = actions.timetable.editTimetable;
  const setPersonalTimetable = actions.timetable.setPersonalTimetable;

  const { data, refetch, isFetching, isSuccess, isError, dataUpdatedAt } =
    trpc.ical.getUSTLessons.useQuery(
      {
        plannerURL: timetable.plannerURL,
      },
      {
        retry: false,
        enabled: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: ({ lessons }) => {
          if (personal) setPersonalTimetable({ ...timetable, lessons });
          else editTimetable({ ...timetable, lessons });
        },
        onError: (err) => {
          console.error(err);
        },
      },
    );

  // Original lessons
  const [prevLessons] = useState(() => timetable.lessons);

  // Only refetch after a minute
  useEffect(() => {
    const timeSinceLastUpdate =
      new Date().getTime() - new Date(dataUpdatedAt).getTime();

    if (timeSinceLastUpdate > 60 * 1000) refetch();
  }, [dataUpdatedAt, refetch]);

  return (
    <div
      key={timetable.config.id}
      className="flex h-10 flex-shrink-0 items-center gap-2 px-4"
    >
      <ColorChip color={timetable.config.color} />
      <span title={timetable.name} className="flex-grow truncate">
        {timetable.name}
      </span>

      {isFetching && (
        <IconRefresh
          stroke={1.75}
          className="h-5 w-5 flex-shrink-0 animate-spin text-fg-100"
        />
      )}

      {!isFetching && isSuccess && (
        <>
          {/* Check if lessons have been updated */}
          {JSON.stringify(prevLessons) !== JSON.stringify(data.lessons) && (
            <span className="whitespace-nowrap rounded-sm bg-emerald-500/50 px-2 py-[2px] text-xs">
              Updated!
            </span>
          )}

          <span className="whitespace-nowrap text-xs">
            Last checked at{" "}
            {new Date(dataUpdatedAt)
              .toLocaleTimeString("en-US", {
                timeStyle: "short",
              })
              .toLowerCase()}
          </span>

          <IconCheck
            stroke={1.75}
            className="h-5 w-5 flex-shrink-0 text-emerald-500"
          />
        </>
      )}

      {!isFetching && isError && (
        <>
          <span className="whitespace-nowrap rounded-sm bg-red-500/50 px-2 py-[2px] text-xs">
            Failed
          </span>
          <IconX stroke={1.75} className="h-5 w-5 flex-shrink-0 text-red-500" />
        </>
      )}
    </div>
  );
};

const RefreshModal = () => {
  const [openRefreshModal, setOpenRefreshModal] = useState(false);

  const combinedTimetables = useTrackedStore().timetable.combinedTimetables();

  return (
    <Modal open={openRefreshModal} onOpenChange={setOpenRefreshModal}>
      <ModalTrigger asChild>
        <Button icon title="Refresh" onClick={() => setOpenRefreshModal(true)}>
          <IconRefresh stroke={1.75} className="h-5 w-5" />
        </Button>
      </ModalTrigger>

      <ModalContent open={openRefreshModal} onOpenChange={setOpenRefreshModal}>
        <ModalTitle>Refresh</ModalTitle>

        <div className="flex max-h-80 flex-col overflow-y-auto">
          {combinedTimetables.map((timetable, i) => (
            // Personal timetable is at index 0
            <TimetableStatus
              key={timetable.config.id}
              personal={i === 0}
              timetable={timetable}
            />
          ))}

          {combinedTimetables.length === 0 && (
            <span className="text-center text-sm">
              Add some timetables first!
            </span>
          )}
        </div>

        <ModalControl>
          <ModalClose asChild>
            <Button fullWidth>
              <IconX stroke={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default RefreshModal;
