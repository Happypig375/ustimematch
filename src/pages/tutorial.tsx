import {
  IconCalendarTime,
  IconFolderPlus,
  IconGripVertical,
  IconRefresh,
  IconShare,
} from "@tabler/icons";
import clsx from "clsx";
import { type NextPage } from "next";
import Image from "next/image";
import Header from "@components/Header";
import Tips from "@components/ui/Tips";
import importImage from "../../public/import.png";

const Tutorial: NextPage = () => {
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
            <Tips image>
              <Image
                src={importImage}
                alt="Timetable Planner export screenshot"
                className="rounded-md"
              />
            </Tips>
          </h3>
          <ul>
            <li>
              Navigate to{" "}
              <strong>
                <IconCalendarTime className="relative -top-[2px] inline-block h-4 w-4" />
                &#8202;Timetable Planner
              </strong>
              . (via the link at top-right hand corner)
            </li>
            <li>
              Click <strong>Export</strong> for your desired timetable.
            </li>
            <li>
              Click <strong>Copy iCalendar File URL</strong> and copy the URL.
            </li>
            <li>
              Go back to USTimematch and click{" "}
              <strong>Add Personal Timetable</strong>.
            </li>
            <li>Fill in the links and the rest of the information.</li>
          </ul>
          <ul className="marker:text-red-500 marker:content-['*']">
            <li>
              If you visit Timetable Planner on mobile devices, please make sure
              to request for desktop site.
            </li>
            <li className="break-all">
              URL format: https://admlu65.ust.hk/planner/export/
              {/* <span className="blur-lg">qwertyuiopasdfghjl</span> */}
              _____.ics
            </li>
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
                Drag
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
                &#8202;Refresh
              </strong>{" "}
              will update the timetables from Timetable Planner.
            </li>
            <li>
              In case anyone swapped lessons, you can easily get the latest
              version.
            </li>
          </ul>
        </article>
      </div>
    </Header>
  );
};

export default Tutorial;
