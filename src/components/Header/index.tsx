import * as Separator from "@radix-ui/react-separator";
import { IconMoonStars, IconSunHigh } from "@tabler/icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, type HTMLAttributes } from "react";
import Button from "@ui/Button";
import NavLink from "@ui/NavLink";
import MobileMenu from "./MobileMenu";

const Header = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  const { theme, setTheme } = useTheme();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="mx-auto flex h-full max-w-screen-2xl flex-col gap-2 bg-bg-100 p-2 sm:gap-3 sm:p-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
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

        <div className="flex gap-4 sm:gap-6">
          {/* Navigation links */}
          <div className="hidden items-center sm:flex sm:gap-8">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/tutorial">Tutorial</NavLink>
            <NavLink href="https://admlu65.ust.hk" external>
              Timetable Planner
            </NavLink>
          </div>

          <Button
            icon
            title="Toggle Dark Mode"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {hydrated && theme === "light" ? (
              <IconSunHigh stroke={1.75} className="h-5 w-5" />
            ) : (
              <IconMoonStars stroke={1.75} className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile navigation menu */}
          <MobileMenu />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-grow overflow-auto rounded-md border border-border-100 bg-bg-200">
        {children}
      </div>
    </div>
  );
};

export default Header;
