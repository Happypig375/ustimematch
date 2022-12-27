import Header from "../components/Header";
import * as Separator from "@radix-ui/react-separator";
import { type NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <Header>
      <div className="flex w-full items-center justify-center">
        <div className="flex h-8 items-center gap-3">
          <span className="text-xl font-bold">404</span>
          <Separator.Root
            decorative
            orientation="vertical"
            className="h-full w-[0.1rem] bg-black"
          />
          <span className="text-base">This page could not be found.</span>
        </div>
      </div>
    </Header>
  );
};

export default NotFound;
