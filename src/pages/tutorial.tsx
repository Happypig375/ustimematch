import Image from "next/image";
import Paragraph from "@ui/Paragraph";
import Header from "../components/Header";
import exportImg from "../../public/export.png";

const Tutorial = () => {
  return (
    <Header>
      <div className="flex w-full flex-col gap-8 overflow-auto py-4 px-6 sm:py-8 sm:px-10">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
          <Paragraph>
            <Paragraph.Title>Importing</Paragraph.Title>
            <ol className="flex list-inside list-decimal flex-col gap-2 text-sm sm:text-base">
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
              <p className="text-[0.825rem] text-gray-600 before:pr-1 before:text-red-400 before:content-['*']">
                You will need to request for desktop site when using mobile
                devices.
              </p>
              <p className="text-[0.825rem] text-gray-600 before:pr-1 before:text-red-400 before:content-['*']">
                The URL should be in the format of
                &quot;https://admlu65.ust.hk/planner/export/xxxxx.ics&quot;
              </p>
            </ol>
          </Paragraph>

          <div className="max-w-[512px]">
            <Image
              src={exportImg}
              placeholder="blur"
              alt="How to export from Timetable Planner"
            />
          </div>
        </div>

        <Paragraph>
          <Paragraph.Title>Sharing</Paragraph.Title>
          <Paragraph.Body>
            You can share all the timetables imported or only the visible ones.
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
          <Paragraph.Body>Mobile: Long pressing before dragging</Paragraph.Body>
        </Paragraph>
      </div>
    </Header>
  );
};

export default Tutorial;
