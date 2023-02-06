import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import DevTool from "@components/DevTool";
import Explorer from "@components/Explorer";
import Header from "@components/Header";
import PersistHandler from "@components/PersistHandler";
import ReceiveModal from "@components/Share/ReceiveModal";
import Tour from "@components/Tour";
import WeekView from "@components/WeekView";

// For preventing hydration error
const Skeleton = dynamic(() => import("@components/Skeleton"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [hydrated, setHydrated] = useState(false);

  return (
    <Header>
      <PersistHandler hydrated={hydrated} setHydrated={setHydrated} />

      <ReceiveModal />

      <DevTool />

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
  );
};

export default Home;
