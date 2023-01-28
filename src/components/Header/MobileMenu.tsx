import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  IconCalendarTime,
  IconDots,
  IconInfoCircle,
  IconQuestionCircle,
  IconUserCircle,
} from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";
import React from "react";
import Button from "@components/ui/Button";
import NavLink from "@components/ui/NavLink";
import { menuVariants } from "@components/ui/variants";

const MobileMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { status } = useSession();

  return (
    <DropdownMenu.Root open={openMenu} onOpenChange={setOpenMenu}>
      <DropdownMenu.Trigger asChild>
        <Button
          title={`${openMenu ? "Close" : "Open"} Navigation Menu`}
          icon
          className="sm:hidden"
          aria-label="Open navigation menu"
        >
          <IconDots strokeWidth={1.75} className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {openMenu && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              forceMount
              align="end"
              sideOffset={4}
              // Prevents focusing on the trigger when closing
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                exit="close"
                animate="open"
                initial="close"
                variants={menuVariants}
                className={clsx(
                  "z-50 origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-md border border-border-100 bg-bg-200 shadow-elevation",
                  // Padding for dark mode shadow-elevation (highlight), otherwise NavLink hover/active will overlap it
                  "dark:border-none dark:p-[0.5px]",
                )}
              >
                {status === "unauthenticated" && (
                  <DropdownMenu.Item asChild>
                    <NavLink
                      inMenu
                      href="/auth/signin"
                      icon={
                        <IconUserCircle
                          strokeWidth={1.75}
                          className="h-4 w-4"
                        />
                      }
                    >
                      Sign In
                    </NavLink>
                  </DropdownMenu.Item>
                )}

                {status === "authenticated" && (
                  <DropdownMenu.Item asChild>
                    <NavLink
                      inMenu
                      href="/account"
                      icon={
                        <IconUserCircle
                          strokeWidth={1.75}
                          className="h-4 w-4"
                        />
                      }
                    >
                      Account
                    </NavLink>
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/about"
                    icon={
                      <IconInfoCircle strokeWidth={1.75} className="h-4 w-4" />
                    }
                  >
                    About
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/tutorial"
                    icon={
                      <IconQuestionCircle
                        strokeWidth={1.75}
                        className="h-4 w-4"
                      />
                    }
                  >
                    Tutorial
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    external
                    href="https://admlu65.ust.hk"
                    icon={
                      <IconCalendarTime
                        strokeWidth={1.75}
                        className="h-4 w-4"
                      />
                    }
                  >
                    Timetable Planner
                  </NavLink>
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};

export default MobileMenu;
