import { env } from "../env/server.mjs";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import Header from "../components/Header";
import { type NextPage } from "next";

export const getStaticProps = () => {
  return {
    props: {},
    notFound: env.NODE_ENV === "production",
  };
};

const Test: NextPage = () => {
  return (
    <Header>
      <div className="w-full p-4">
        <div className="flex gap-4">
          <Button fullWidth>Full Width</Button>
          <Button icon>
            <BanknotesIcon className="h-5 w-5" />
          </Button>
          <Button disabled>Disabled</Button>
          <Button icon loading disabled>
            Loading
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default Test;
