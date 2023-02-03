import { LazyMotion } from "framer-motion";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import Explorer from "@components/Explorer";
import Header from "@components/Header";
import PersistHandler from "@components/PersistHandler";
import ReceiveModal from "@components/Share/ReceiveModal";
import WeekView from "@components/WeekView";

const Tour = dynamic(() => import("@components/Tour"), {
  ssr: false,
});

// For preventing hydration error
const Skeleton = dynamic(() => import("@components/Skeleton"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [hydrated, setHydrated] = useState(false);

  return (
    <LazyMotion
      strict
      features={async () =>
        (await import("@components/ui/motion/features")).default
      }
    >
      <Header>
        <PersistHandler hydrated={hydrated} setHydrated={setHydrated} />

        <ReceiveModal />

        {hydrated ? (
          <>
            <Tour />
            <Explorer />
            <WeekView />
          </>
        ) : (
          <Skeleton />
        )}
      </Header>
    </LazyMotion>
  );
};

export default Home;
