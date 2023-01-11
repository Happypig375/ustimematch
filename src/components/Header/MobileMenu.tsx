import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  IconCalendarTime,
  IconDots,
  IconInfoCircle,
  IconQuestionCircle,
} from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import React from "react";
import Button from "@ui/Button";
import NavLink from "@ui/NavLink";
import { menuVariants } from "@ui/variants";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button icon className="sm:hidden" aria-label="Open navigation menu">
          <IconDots stroke={1.75} className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
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
                className="z-50 origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-md border border-border-100 bg-bg-100 shadow-lg"
              >
                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/about"
                    icon={<IconInfoCircle stroke={1.75} className="h-4 w-4" />}
                  >
                    About
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/tutorial"
                    icon={
                      <IconQuestionCircle stroke={1.75} className="h-4 w-4" />
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
                      <IconCalendarTime stroke={1.75} className="h-4 w-4" />
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
