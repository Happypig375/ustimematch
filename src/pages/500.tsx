import * as Separator from "@radix-ui/react-separator";
import Header from "@components/Header";

const Custom500 = () => {
  return (
    <Header>
      <div className="flex w-full items-center justify-center">
        <div className="flex h-8 items-center gap-3">
          <span className="text-xl font-bold">500</span>
          <Separator.Root
            decorative
            orientation="vertical"
            className="h-full w-[1.5px] bg-fg-200"
          />
          <span className="text-sm">Internal Server Error.</span>
        </div>
      </div>
    </Header>
  );
};

export default Custom500;
