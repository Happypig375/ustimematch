import * as Separator from "@radix-ui/react-separator";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type HTMLAttributes } from "react";
import NavLink from "@components/ui/NavLink";
import MobileMenu from "./MobileMenu";

const Header = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  const { status } = useSession();

  return (
    <div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-2 bg-bg-100 p-2 sm:gap-3 sm:p-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-2">
        {/* Brand */}
        <Link href="/" className="flex h-8 items-center gap-3 text-brand">
          <h1 className="text-lg font-medium sm:text-xl">HKUST</h1>
          <Separator.Root
            decorative
            orientation="vertical"
            className="h-full w-[1.5px] bg-brand"
          />
          <h1 className="text-base sm:text-lg">Timematch</h1>
        </Link>

        <div className="flex gap-4">
          {/* Navigation links */}
          <div className="hidden items-center gap-8 sm:flex">
            {status === "unauthenticated" && (
              <NavLink href="/auth/signin">Sign In</NavLink>
            )}
            {status === "authenticated" && (
              <NavLink href="/account">Account</NavLink>
            )}

            <NavLink href="/about">About</NavLink>
            <NavLink href="/tutorial">Tutorial</NavLink>
            <NavLink href="https://admlu65.ust.hk" external>
              Timetable Planner
            </NavLink>
            <NavLink href="https://github.com/alanleungcn/ustimematch" external>
              Source Code
            </NavLink>
          </div>

          {/* Mobile navigation menu */}
          <MobileMenu />
        </div>
      </div>

      {/* Main content */}
      {/* Focus ring for scrollable container */}
      <div className="focus-visible-ring flex flex-grow overflow-auto rounded-md border border-border-100 bg-bg-200">
        {children}
      </div>
    </div>
  );
};

export default Header;
