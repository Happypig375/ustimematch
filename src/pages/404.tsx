import * as Separator from "@radix-ui/react-separator";
import { type NextPage } from "next";
import Header from "@components/Header";

const NotFound: NextPage = () => {
  return (
    <Header>
      <div className="flex w-full items-center justify-center">
        <div className="flex h-8 items-center gap-3">
          <span className="text-xl font-bold">404</span>
          <Separator.Root
            decorative
            orientation="vertical"
            className="h-full w-[1.5px] bg-fg-200"
          />
          <span className="text-sm">This page could not be found.</span>
        </div>
      </div>
    </Header>
  );
};

export default NotFound;
