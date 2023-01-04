import { type NextPage } from "next";
import dynamic from "next/dynamic.js";
import toast from "react-hot-toast";
import Header from "@components/Header";
import Button from "@ui/Button";
import { useTrackedStore } from "@store/index";
import { env } from "../env/server.mjs";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export const getStaticProps = () => {
  return {
    props: {},
    notFound: env.NODE_ENV === "production",
  };
};

const Test: NextPage = () => {
  const personalTimetable = useTrackedStore().timetable.personalTimetable();
  const timetables = useTrackedStore().timetable.timetables();

  return (
    <Header>
      <div className="w-full p-4">
        <div className="flex flex-col gap-4">
          {/* <Button fullWidth>Full Width</Button>
          <Button icon>
            <BanknotesIcon className="h-5 w-5" />
          </Button>
          <Button disabled>Disabled</Button>
          <Button icon loading disabled>
            Loading
          </Button> */}
          {/* <Button
            fullWidth
            title="Import"
            // onClick={toggleShowImportModal}
          >
            <SquaresPlusIcon className="h-5 w-5" />
            Import
          </Button>
          <Button fullWidth>
            <UserPlusIcon className="h-5 w-5" />
            Personal Timetable
          </Button>

          <Button
            onClick={() => toast.error("Testing LONG LONG LONG LONG MESSAGE")}
          >
            Toast Error
          </Button>
          <Button
            onClick={() => toast.success("Testing LONG LONG LONG LONG MESSAGE")}
          >
            Toast Success
          </Button>
          <Button onClick={() => toast("Testing LONG LONG LONG LONG MESSAGE")}>
            Toast Normal
          </Button> */}
          Personal Timetable:
          <div className="max-h-[512px] overflow-auto">
            <DynamicReactJson
              src={personalTimetable ? personalTimetable.lessons : {}}
            />
          </div>
          Timetables:
          <div className="max-h-[512px] overflow-auto">
            <DynamicReactJson src={timetables} />
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Test;
