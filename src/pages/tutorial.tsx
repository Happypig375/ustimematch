import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { type NextPage } from "next";
import Header from "@components/Header";
import Button from "@ui/Button";
import Paragraph from "@ui/Paragraph";

const Tutorial: NextPage = () => {
  return (
    <Header>
      <div className="w-full overflow-auto py-4 px-6 sm:py-8 sm:px-10">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-8">
          <Paragraph>
            <Paragraph.Title>Importing</Paragraph.Title>
            <ol className="flex list-inside list-decimal flex-col gap-2 text-xs sm:text-sm">
              <li>
                Navigate to <b>Timetable Planner</b> (you can find the link at
                the top right corner)
              </li>
              <li>
                Click
                <b> Export</b> for your desired timetable
              </li>
              <li>
                Click <b>Copy iCalendar File URL</b>
              </li>
              <li>
                Now go to our home page and click <b>Import</b>, then enter the
                required information
              </li>
              <p className="text-[0.825rem] text-fg-100 before:pr-1 before:text-red-400 before:content-['*']">
                You will need to request for desktop site when using mobile
                devices.
              </p>
              <p className="text-[0.825rem] text-fg-100 before:pr-1 before:text-red-400 before:content-['*']">
                The URL should be in the format of
                &quot;https://admlu65.ust.hk/planner/export/xxxxx.ics&quot;
              </p>
            </ol>
          </Paragraph>

          <Paragraph>
            <Paragraph.Title>Sharing</Paragraph.Title>
            <Paragraph.Body>
              You can share all the timetables imported or only the visible
              ones.
              <br />
              Scan the QR code or share the URL to your friends to import.
              (Navigate to the URL directly)
            </Paragraph.Body>
          </Paragraph>

          <Paragraph>
            <Paragraph.Title>Refresh</Paragraph.Title>
            <Paragraph.Body>
              URL of Timetables are locally stored, any update on Timetable
              Planner will be reflected upon clicking the refresh button.
            </Paragraph.Body>
          </Paragraph>

          <Paragraph>
            <Paragraph.Title>Reordering</Paragraph.Title>
            <Paragraph.Body>
              Timetable on the bottom of the list will be rendered on top.
            </Paragraph.Body>
            <Paragraph.Body>Desktop: Dragging the timetables</Paragraph.Body>
            <Paragraph.Body>
              Mobile: Long pressing before dragging
            </Paragraph.Body>
          </Paragraph>

          <Paragraph>
            <Paragraph.Title>Buttons</Paragraph.Title>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Button icon>
                    <IconChevronLeft stroke={1.75} className="h-5 w-5" />
                  </Button>
                  <Button icon>
                    <IconChevronRight stroke={1.75} className="h-5 w-5" />
                  </Button>
                </div>
                <Paragraph.Body>
                  <b className="font-semibold">Collapse / Expand</b> the
                  left-hand side timetables panel
                </Paragraph.Body>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Button icon>
                    {/* <Bars2Icon className="h-5 w-5 rotate-90" /> */}
                  </Button>
                  <Button icon>
                    {/* <Bars4Icon className="h-5 w-5 rotate-90" /> */}
                  </Button>
                </div>
                <Paragraph.Body>
                  Toggle bettween{" "}
                  <b className="font-semibold">5-days / 7-days</b> view
                </Paragraph.Body>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Button icon>
                    {/* <OutlineClockIcon className="h-5 w-5" /> */}
                  </Button>
                  <Button icon>
                    {/* <SolidClockIcon className="h-5 w-5" /> */}
                  </Button>
                </div>
                <Paragraph.Body>
                  Toggle bettween{" "}
                  <b className="font-semibold">timetable / timematch</b> view
                </Paragraph.Body>
              </div>

              <div className="flex flex-col gap-1">
                <div>
                  <Button icon>
                    {/* <ArrowPathIcon className="h-5 w-5" /> */}
                  </Button>
                </div>
                <Paragraph.Body>Refresh all timetables</Paragraph.Body>
              </div>

              <div className="flex flex-col gap-1">
                <div>
                  <Button icon title="Share">
                    {/* <ShareIcon className="h-5 w-5" /> */}
                  </Button>
                </div>
                <Paragraph.Body>Open sharing screen</Paragraph.Body>
              </div>
            </div>
          </Paragraph>
        </div>
      </div>
    </Header>
  );
};

export default Tutorial;
