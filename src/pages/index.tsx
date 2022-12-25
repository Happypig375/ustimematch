import { type NextPage } from "next";
import Explorer from "../components/Explorer";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Header>
        <Explorer />
      </Header>
    </>
  );
};

export default Home;
