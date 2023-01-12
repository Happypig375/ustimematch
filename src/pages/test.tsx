import { nanoid } from "nanoid";
import { type NextPage } from "next";
// import dynamic from "next/dynamic.js";
import Header from "@components/Header";
import Button from "@ui/Button";
import { actions } from "@store/index";
import { randomHex } from "@utils/randomHex";
import { env } from "../env/server.mjs";
import type { Lesson, Lessons } from "../types/timetable.js";

// const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export const getStaticProps = () => {
  return {
    props: {},
    notFound: env.NODE_ENV === "production",
  };
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const Test: NextPage = () => {
  // const personalTimetable = useTrackedStore().timetable.personalTimetable();
  // const timetablesTree = useTrackedStore().timetable.timetablesTree();
  const addTimetable = actions.timetable.addTimetable;

  const addRandomTimetable = () => {
    const lessons: Lessons = [[], [], [], [], [], [], []];

    for (let i = 0; i < getRandomInt(2, 10); i++) {
      const beginHour = getRandomInt(8, 18);
      const endHour = beginHour + getRandomInt(2, 4);

      const randomLesson: Lesson = {
        name: "test",
        venue: "test",
        begin: `${beginHour.toString().padStart(2, "0")}:${getRandomInt(0, 60)
          .toString()
          .padStart(2, "0")}`,
        end: `${endHour.toString().padStart(2, "0")}:${getRandomInt(0, 60)
          .toString()
          .padStart(2, "0")}`,
        description: "test",
      };

      lessons[getRandomInt(0, 7)]?.push(randomLesson);
    }

    addTimetable({
      config: {
        color: randomHex(),
        id: nanoid(),
        visible: true,
      },
      lessons,
      name: nanoid(),
      plannerURL: "test",
      university: "HKUST",
    });
  };

  return (
    <Header>
      <div className="w-full p-4">
        <div className="flex flex-col gap-4">
          <Button onClick={addRandomTimetable}>Add random timetable</Button>
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
          {/* Personal Timetable:
          <div className="max-h-[1024px] overflow-auto">
            <DynamicReactJson
              src={personalTimetable ? personalTimetable.lessons : {}}
            />
          </div>
          Timetables:
          <div className="max-h-[1024px] overflow-auto">
            <DynamicReactJson src={timetablesTree} />
          </div> */}
        </div>
      </div>
    </Header>
  );
};

export default Test;
