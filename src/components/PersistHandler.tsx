import { BroadcastChannel, createLeaderElection } from "broadcast-channel";
import debounce from "lodash.debounce";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { actions, useTrackedStore } from "@store/index";
import type { TimetableStore } from "@store/timetable";
import { timetableStore } from "@store/timetable";
import { trpc } from "@utils/trpc";

interface BaseMessage {
  action: "SET" | "FLUSH";
}

interface SetMessage extends BaseMessage {
  action: "SET";
  timetableStore: TimetableStore;
}

interface FlushMessage extends BaseMessage {
  action: "FLUSH";
}

type Message = SetMessage | FlushMessage;

const PersistHandler = ({
  hydrated,
  setHydrated,
}: {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}) => {
  const showTour = useTrackedStore().ui.showTour();
  const setTimetableStore = actions.timetable.state;
  const enableLocalStorage = actions.timetable.enableLocalStorage;
  const disableLocalStorage = actions.timetable.disableLocalStorage;

  const router = useRouter();
  const session = useSession();
  const authed = session.status === "authenticated";
  const unauthed = session.status === "unauthenticated";

  const [authHydrated, setAuthHydrated] = useState(false);

  const channel = useMemo(
    () =>
      new BroadcastChannel<Message>("ustimematch_store", { type: "native" }),
    [],
  );
  const elector = useMemo(() => createLeaderElection(channel), [channel]);

  // Hydrate from local storage if unauthed
  useEffect(() => {
    if (unauthed) {
      enableLocalStorage();
      setHydrated(true);
    }
    if (authed) disableLocalStorage();
  }, [authed, unauthed, enableLocalStorage, disableLocalStorage, setHydrated]);

  // Hydrate from database if authed
  const { mutate } = trpc.persist.setPersist.useMutation();

  trpc.persist.getPersist.useQuery(undefined, {
    enabled: authed,
    refetchOnWindowFocus: false,
    onSuccess: ({ timetableStore }) => {
      setTimetableStore(() => timetableStore);
      setAuthHydrated(true);
      setHydrated(true);
    },
    onError: () => {
      toast.error("Failed to load timetables.");
    },
  });

  // Persist store to database with debounce
  const mutateDebounce = useMemo(
    () =>
      debounce(
        (timetableStore: TimetableStore) => mutate({ timetableStore }),
        2000,
      ),
    [mutate],
  );

  useEffect(() => {
    return timetableStore.store.subscribe((timetableStore) => {
      // authed:        prevent unncessary requests if the user sign out in a different tab
      // authHydrated:  prevent initial hydration from triggering mutation
      // elector:       only the leader should mutate
      // showTour:      prevent tour state from triggering mutation
      if (
        !authed ||
        !authHydrated ||
        (elector.hasLeader && !elector.isLeader) ||
        showTour
      )
        return;
      mutateDebounce(timetableStore);
    });
  }, [
    authed,
    authHydrated,
    elector.hasLeader,
    elector.isLeader,
    showTour,
    mutateDebounce,
  ]);

  // Flush debounce before switching route or unloading
  const handleUnload = useCallback(() => {
    if (!authed) return;
    if (!elector.hasLeader || elector.isLeader) mutateDebounce.flush();
    if (elector.hasLeader && !elector.isLeader)
      channel.postMessage({ action: "FLUSH" });
    elector.die();
  }, [authed, elector, mutateDebounce, channel]);

  useEffect(() => {
    router.events.on("routeChangeStart", handleUnload);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      router.events.off("routeChangeStart", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [handleUnload, router.events]);

  // Broadcast channel for syncing timetableStore
  useEffect(() => {
    elector.awaitLeadership().then(() => {
      console.log(
        "%c[Persist Handler] Leader elected",
        "background-color: #a7f3d0; color: black; padding: 6px;",
      );
    });
  }, [elector]);

  useEffect(() => {
    let receiving = false;

    const unsub = timetableStore.store.subscribe((timetableStore) => {
      // receiving: prevent infinite subscription loop
      // hydrated:  prevent initial hydration from triggering postMessage
      // showTour:  prevent tour state from triggering postMessage
      if (receiving || !hydrated || showTour) return;
      console.log(
        "%c[Persist Handler] >> Posting message",
        "background-color: #c7d2fe; color: black; padding: 6px;",
        "\n",
        { ...timetableStore },
      );

      // Some values of timetableStore are proxy, which cause error in broadcast channel.
      channel.postMessage({
        action: "SET",
        timetableStore: JSON.parse(JSON.stringify(timetableStore)),
      });
    });

    const handleMessage = (message: Message) => {
      console.log(
        "%c[Persist Handler] << Received message",
        "background-color: #f5d0fe; color: black; padding: 6px;",
        "\n",
        { ...message },
      );
      // Prevent other tabs from interfering with tour
      // BUG: When authed, if another tab changes states when tour is active,
      // the tab with tour active will have an outdated state.
      if (showTour) return;
      if (message.action === "FLUSH") return mutateDebounce.flush();

      receiving = true;
      setTimetableStore(() => message.timetableStore);
      receiving = false;
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      unsub();
    };
  }, [channel, elector, setTimetableStore, mutateDebounce, hydrated, showTour]);

  return null;
};

export default PersistHandler;
