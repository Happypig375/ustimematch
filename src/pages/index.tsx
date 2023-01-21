import { type NextPage } from "next";
import { useState } from "react";
import Explorer from "@components/Explorer";
import Header from "@components/Header";
import PersistHandler from "@components/PersistHandler";
import ReceiveModal from "@components/Share/ReceiveModal";
import WeekView from "@components/WeekView";

const Home: NextPage = () => {
  const [hydrated, setHydrated] = useState(false);

  return (
    <Header>
      {hydrated && (
        <>
          <Explorer />
          <WeekView />
        </>
      )}

      <ReceiveModal />
      <PersistHandler setHydrated={setHydrated} />
    </Header>
  );
};

export default Home;
