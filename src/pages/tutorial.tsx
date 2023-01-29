import {
  IconCalendarTime,
  IconFolderPlus,
  IconGripVertical,
  IconPlus,
  IconRefresh,
  IconShare,
} from "@tabler/icons-react";
import clsx from "clsx";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@components/Header";
import Button from "@components/ui/Button";
import Tips from "@components/ui/Tips";
import { uiStore } from "@store/ui";
import exportFromPlanner from "../../public/export-from-planner.png";

const Tutorial: NextPage = () => {
  const router = useRouter();

  return (
    <Header>
      <div className="w-full overflow-auto p-6">
        <article
          className={clsx(
            "prose prose-sm mx-auto",
            "sm:prose-base",
            "dark:prose-invert",
            "prose-hr:border-border-100",
          )}
        >
          <h3 id="importing" className="flex items-center gap-2">
            Importing
          </h3>
          <ul>
            <li>
              Navigate to{" "}
              <strong>
                <IconCalendarTime className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;
                <Link href="https://admlu65.ust.hk/" target="_blank">
                  Timetable Planner
                </Link>
              </strong>
              .
              <p className="!mb-0 flex text-xs before:mr-1 before:text-red-500 before:content-['*'] sm:text-sm">
                Make sure to request for desktop site if you&apos;re on mobile.
              </p>
            </li>
            <li>
              Click <strong>Export</strong> on your desired timetable.
              <Tips
                image
                triggerClassName="!m-0 !ml-1 inline-flex align-text-bottom"
              >
                <Image
                  src={exportFromPlanner}
                  placeholder="blur"
                  className="rounded-md"
                  alt="How to export as iCalendar File URL from Timetable Planner"
                />
              </Tips>
            </li>
            <li>
              Click <strong>Copy iCalendar File URL</strong> and copy the link.
              <p className="!mb-0 flex break-all text-xs before:mr-1 before:text-red-500 before:content-['*'] sm:text-sm">
                <span>
                  e.g.{" "}
                  <code className="font-normal">
                    https://admlu65.ust.hk/planner/export/_.ics
                  </code>
                </span>
              </p>
            </li>
            <li>
              Come back and click{" "}
              <strong>
                <IconPlus className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;Personal Timetable
              </strong>
              .
            </li>
            <li>Fill in the link and the rest of the information.</li>
          </ul>

          <h3 id="sharing">Sharing</h3>
          <ul>
            <li>
              Click{" "}
              <strong>
                <IconShare className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;Share
              </strong>{" "}
              on the top-left hand corner.
            </li>
            <li>Select desired timetables to obtain link/QR code.</li>
            <li>
              Share the link with your friends or let them scan the QR code.
            </li>
          </ul>

          <h3 id="folders">Folders</h3>
          <ul>
            <li>
              <strong>
                <IconFolderPlus className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;Create Folders
              </strong>{" "}
              for better organization, they can be nested up to 3 levels.
            </li>
            <li>
              <strong>
                <IconGripVertical className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;Drag
              </strong>{" "}
              around timetables/folders to your desired order.
            </li>
            <li>Drag to the left/right for moving into/out of folders.</li>
          </ul>

          <h3 id="refresh">Refresh</h3>
          <ul>
            <li>
              Clicking{" "}
              <strong>
                <IconRefresh className="relative -top-[2px] inline-block h-4 w-4" />
                &nbsp;Refresh
              </strong>{" "}
              will update the timetables from Timetable Planner.
            </li>
            <li>
              In case anyone swapped lessons, you can easily get the latest
              version.
            </li>
          </ul>

          <hr />

          <Button
            fullWidth
            onClick={() => {
              uiStore.set.showTour(true);
              router.push("/");
            }}
            data-cy="tour-launch"
            className="text-base"
          >
            Launch Interactive Tutorial
          </Button>
        </article>
      </div>
    </Header>
  );
};

export default Tutorial;
