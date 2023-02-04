import clsx from "clsx";
import { type NextPage } from "next";
import Link from "next/link";
import Header from "@components/Header";
import packageJson from "../../package.json";

const About: NextPage = () => {
  return (
    <Header>
      <div className="w-full overflow-auto p-6">
        <article
          className={clsx(
            "prose prose-sm mx-auto",
            "sm:prose-base",
            "dark:prose-invert",
            "prose-code:before:hidden prose-code:after:hidden",
            "prose-hr:border-border-100",
          )}
        >
          <h3 id="features">Features</h3>
          <ul>
            <li>Keep track of you and your friends&apos; timetables.</li>
            <li>Easily toggle between whose timetable to view.</li>
            <li>Search for free common time slots.</li>
            <li>Share timetables within a few clicks.</li>
            <li>Refresh on demand in case of lessons swapping.</li>
            <li>Folders for organization.</li>
            <li>And more to come...</li>
          </ul>
          <h3 id="enquiry">Enquiry</h3>
          <p>
            Please contact us by{" "}
            <Link href="mailto:support@ustimematch.com">email</Link> for bug
            reports, feature requests, etc.
          </p>
          <h3 id="credits">Credits</h3>
          <p>USTimematch is inspired by USThing and Timetable Planner.</p>
          <hr />
          <code>v{packageJson.version}</code>
          &emsp;<Link href="">Changelog</Link>&emsp;
          <Link href="">Donations</Link>&emsp;
          <Link href="">Terms</Link>
        </article>
      </div>
    </Header>
  );
};

export default About;
