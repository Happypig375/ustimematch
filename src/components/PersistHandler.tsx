import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { actions } from "@store/index";
import type { TimetableStore } from "@store/timetable";
import { timetableStore } from "@store/timetable";
import { trpc } from "@utils/trpc";

const PersistHandler = ({
  setHydrated,
}: {
  setHydrated: (hydrated: boolean) => void;
}) => {
  const session = useSession();
  const enableLocalStorage = actions.timetable.enableLocalStorage;
  const disableLocalStorage = actions.timetable.disableLocalStorage;

  useEffect(() => {
    if (session.status === "unauthenticated") {
      enableLocalStorage();
      setHydrated(true);
    }
    if (session.status === "authenticated") disableLocalStorage();
  }, [session.status, setHydrated, disableLocalStorage, enableLocalStorage]);

  // Hydrate store from database
  const [authHydrated, setAuthHydrated] = useState(false);

  const { mutate } = trpc.persist.setPersist.useMutation();
  trpc.persist.getPersist.useQuery(undefined, {
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
    onSuccess: ({ personalTimetable, timetablesTree }) => {
      timetableStore.set.personalTimetable(personalTimetable);
      timetableStore.set.timetablesTree(timetablesTree);
      setAuthHydrated(true);
      setHydrated(true);
    },
    onError: () => {
      toast.error("Failed to load timetables.");
    },
  });

  // Persist timetable store to database with debounce
  const mutateDebounce = useMemo(
    () =>
      debounce(
        (timetableStore: TimetableStore) => mutate({ timetableStore }),
        10000,
      ),
    [mutate],
  );

  useEffect(() => {
    // Prevent initial hydration from triggering mutation
    if (authHydrated)
      return timetableStore.store.subscribe((timetableStore) => {
        mutateDebounce(timetableStore);
      });
  }, [authHydrated, mutateDebounce]);

  // Flush debounce when unloading
  const handleUnload = useCallback(
    () => mutateDebounce.flush(),
    [mutateDebounce],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [handleUnload]);

  return null;
};

export default PersistHandler;
