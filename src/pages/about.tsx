import { CogIcon } from "@heroicons/react/24/outline";
import Paragraph from "@ui/Paragraph";
import Header from "../components/Header";
import { env } from "../env/client.mjs";
import { type NextPage } from "next";

const About: NextPage = () => {
  return (
    <Header>
      <div className="w-full overflow-auto py-4 px-6 sm:py-8 sm:px-10">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-8">
          <Paragraph>
            <Paragraph.Title>Features</Paragraph.Title>
            <Paragraph.Body>
              Search for common time slots between friends.
            </Paragraph.Body>
            <Paragraph.Body>
              Share dynamically updated timetables among different people.
            </Paragraph.Body>
            <Paragraph.Body>
              Locally or remotely store timetables exported from Timetable
              Planner.
            </Paragraph.Body>
          </Paragraph>

          <Paragraph>
            <Paragraph.Title>Credits</Paragraph.Title>
            <Paragraph.Body>
              Inspired by USThing and Timetable Planner
            </Paragraph.Body>
          </Paragraph>

          {/* Version number */}
          <footer className="flex items-center gap-1 text-sm">
            <CogIcon className="h-5 w-5" />v{env.NEXT_PUBLIC_VERSION}
          </footer>
        </div>
      </div>
    </Header>
  );
};

export default About;
