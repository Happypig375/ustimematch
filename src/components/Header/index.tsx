import NavLink from "@ui/NavLink";
import Link from "next/link";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import * as Separator from "@radix-ui/react-separator";
import MobileMenu from "./MobileMenu";

const Header = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:py-4">
      <div className="flex items-center justify-between gap-8 px-2">
        {/* Header text */}
        <Link href="/" className="flex h-8 items-center gap-3">
          <h1 className="text-lg font-medium sm:text-xl">HKUST</h1>
          <Separator.Root
            decorative
            orientation="vertical"
            className="h-full w-[0.1rem] bg-brand"
          />
          <h1 className="text-base sm:text-lg">Timematch</h1>
        </Link>

        {/* Navigation links */}
        <div className="hidden sm:flex sm:gap-8">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/tutorial">Tutorial</NavLink>
          <NavLink href="https://admlu65.ust.hk" external>
            Timetable Planner
          </NavLink>
        </div>

        {/* Mobile navigation menu */}
        <MobileMenu />
      </div>

      {/* Main content */}
      <div className="flex flex-grow overflow-auto rounded-md border border-gray-200 bg-bg-light-200">
        {children}
      </div>
    </div>
  );
};

export default Header;
