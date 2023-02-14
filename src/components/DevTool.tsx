import { IconTestPipe, IconX } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { actions } from "@store/index";
import { randomHex } from "@utils/randomHex";
import { trpc } from "@utils/trpc";
import Button from "./ui/Button";

export const DevTool = () => {
  const [openDevTool, setOpenDevTool] = useState(false);
  const [urls, setUrls] = useState("");
  const addTimetable = actions.timetable.addTimetable;

  const lessonsQuery = trpc.useQueries((t) =>
    // urls.map((id) => t.post.byId({ id })),
    urls.split("\n").map((url) =>
      t.ical.getUSTLessons(
        { plannerURL: url },
        {
          enabled: false,
          onSuccess: ({ lessons }) => {
            addTimetable({
              config: {
                color: randomHex(),
                id: nanoid(),
                visible: true,
              },
              lessons,
              name: Math.random().toString(36).substring(7),
              plannerURL: url,
              university: "HKUST",
            });
          },
        },
      ),
    ),
  );

  const onClickAdd = () => {
    lessonsQuery.forEach((query) => {
      query.refetch();
    });
  };

  return process.env.NODE_ENV === "development" ? (
    <div className="fixed right-2 bottom-2 z-50 rounded-md bg-bg-200 shadow-elevation">
      {openDevTool ? (
        <div className="flex flex-col gap-4 p-2">
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="flex-grow rounded-md"
          />

          <Button fullWidth onClick={onClickAdd}>
            Load Timetables
          </Button>

          <div className="flex gap-4">
            <Button
              fullWidth
              onClick={() => localStorage.removeItem("timetable")}
            >
              Clear localstorge
            </Button>

            <Button icon onClick={() => setOpenDevTool(false)}>
              <IconX strokeWidth={1.75} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <Button icon onClick={() => setOpenDevTool(true)}>
          <IconTestPipe strokeWidth={1.75} className="h-5 w-5" />
        </Button>
      )}
    </div>
  ) : null;
};

export default DevTool;
