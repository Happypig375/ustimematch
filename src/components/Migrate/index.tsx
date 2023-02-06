import {
  IconCheck,
  IconCloudUpload,
  IconListCheck,
  IconX,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Selector from "@components/Select";
import Button from "@components/ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
  ModalTrigger,
} from "@components/ui/Modal";
import Tips from "@components/ui/Tips";
import type { TimetableStore } from "@store/timetable";
import {
  defaultTimetableStore,
  timetableStore,
  ZTimetableStore,
} from "@store/timetable";
import { filterByTimetableIds, rawFlatten } from "@utils/sortableTree";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import type { TimetableItem } from "../../types/tree";

const Migrate = () => {
  const router = useRouter();
  const [openMigrate, setOpenMigrate] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    if (openMigrate) return;
    setCheckedIds([]);
  }, [openMigrate]);

  const [localTimetableStore, setLocalTimetableStore] =
    useState<TimetableStore>(defaultTimetableStore);
  const [localCombinedTimetables, setLocalCombinedTimetables] = useState<
    Timetable[]
  >([]);

  useEffect(() => {
    const stored = localStorage.getItem("timetable");
    if (!stored) return;

    const result = ZTimetableStore.safeParse(JSON.parse(stored).state);

    if (!result.success) return;
    setLocalTimetableStore(result.data);

    const timetables = rawFlatten(result.data.timetablesTree)
      .filter((item): item is TimetableItem => item.type === "TIMETABLE")
      .map((item) => item.timetable);

    const personalTimetable = result.data.personalTimetable;
    if (!personalTimetable) setLocalCombinedTimetables(timetables);
    else setLocalCombinedTimetables([personalTimetable, ...timetables]);
  }, []);

  const empty = localCombinedTimetables.length === 0;
  const checkedAll = checkedIds.length === localCombinedTimetables.length;

  const toggleCheckAll = () => {
    if (checkedAll) setCheckedIds([]);
    else setCheckedIds(localCombinedTimetables.map((t) => t.config.id));
  };

  const { mutate, isLoading } = trpc.persist.setPersist.useMutation({
    onSuccess: () => {
      router.push("/");
      toast.success(
        `Successfully migrated ${checkedIds.length} timetable${
          checkedIds.length > 1 ? "s" : ""
        }.`,
      );
    },
    onError: () => {
      toast.error("Migration failed, please try again later.");
      setCheckedIds([]);
    },
  });

  const migrate = () => {
    const { personalTimetable, timetablesTree } = timetableStore.get.state();

    const newTimetablesTree = filterByTimetableIds(
      localTimetableStore.timetablesTree,
      checkedIds,
    );

    if (
      localTimetableStore.personalTimetable &&
      checkedIds.includes(localTimetableStore.personalTimetable.config.id)
    ) {
      newTimetablesTree.unshift({
        type: "TIMETABLE",
        id: nanoid(),
        timetable: localTimetableStore.personalTimetable,
      });
    }

    mutate({
      timetableStore: {
        personalTimetable,
        timetablesTree: [...timetablesTree, ...newTimetablesTree],
      },
    });
  };

  const controlledSetOpenMigrate = (open: boolean) => {
    !isLoading && setOpenMigrate(open);
  };

  return (
    <Modal open={openMigrate} onOpenChange={controlledSetOpenMigrate}>
      <ModalTrigger asChild>
        <Button fullWidth>
          <IconCloudUpload strokeWidth={1.75} className="h-5 w-5" />
          Migrate Local Data
        </Button>
      </ModalTrigger>

      <ModalContent open={openMigrate} onOpenChange={controlledSetOpenMigrate}>
        <div className="flex items-center justify-between">
          <ModalTitle>Migrate Local Data</ModalTitle>

          <div className="flex gap-2">
            <span className="text-sm">
              {checkedIds.length} / {localCombinedTimetables.length} Selected
            </span>
            <Tips>
              <p>
                Selected items will be appended to your account&apos;s explorer.
              </p>
              <p>Note that existing timetables will NOT be overwritten.</p>
            </Tips>
          </div>
        </div>

        {empty ? (
          <span className="grid h-16 place-items-center text-sm">
            No timetables found in local storage.
          </span>
        ) : (
          <Selector
            showDuplication
            disabled={isLoading}
            timetableStore={localTimetableStore}
            checkedIds={checkedIds}
            onCheckedIdsChange={setCheckedIds}
          />
        )}

        <ModalControl>
          <Button
            icon
            disabled={empty || isLoading}
            onClick={toggleCheckAll}
            title={checkedAll ? "Unselect All" : "Select All"}
          >
            <IconListCheck strokeWidth={1.75} className="h-5 w-5" />
          </Button>

          <ModalClose asChild>
            <Button fullWidth disabled={isLoading}>
              <IconX strokeWidth={1.75} className="h-5 w-5" />
              Cancel
            </Button>
          </ModalClose>

          <Button
            fullWidth
            disabled={checkedIds.length === 0 || isLoading}
            onClick={migrate}
            loading={isLoading}
          >
            <IconCheck strokeWidth={1.75} className="h-5 w-5" />
            Confirm
          </Button>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default Migrate;
