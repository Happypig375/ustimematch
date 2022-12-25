import { CogIcon } from "@heroicons/react/20/solid";
import Paragraph from "@ui/Paragraph";
import Header from "../components/Header";
import { env } from "../env/client.mjs";

const About = () => {
  return (
    <Header>
      <div className="flex flex-col gap-8 overflow-auto py-4 px-6 sm:py-8 sm:px-10">
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
        <footer className="mt-auto text-sm">
          <p className="flex gap-1">
            <CogIcon className="h-5 w-5 text-inherit" />v
            {env.NEXT_PUBLIC_VERSION}
          </p>
        </footer>
      </div>
    </Header>
  );
};

export default About;
