import {
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "@ui/Button";
import NavLink from "@ui/NavLink";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";
import React from "react";

const menuVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.4,
    },
  },
  close: {
    scale: 0,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.4,
    },
  },
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button icon className="sm:hidden" aria-label="Open navigation menu">
          <EllipsisHorizontalIcon className="h-5 w-5" />
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
                className="origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-md border border-border-gray-100 bg-bg-light-100 shadow-lg"
              >
                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/about"
                    icon={<InformationCircleIcon className="h-4 w-4" />}
                  >
                    About
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    href="/tutorial"
                    icon={<QuestionMarkCircleIcon className="h-4 w-4" />}
                  >
                    Tutorial
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink
                    inMenu
                    external
                    href="https://admlu65.ust.hk"
                    icon={<CalendarDaysIcon className="h-4 w-4" />}
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
