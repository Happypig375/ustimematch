import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "@ui/Button";
import NavLink from "@ui/NavLink";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import React from "react";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button icon aria-label="Open navigation menu" className="sm:hidden">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              forceMount
              asChild
              align="end"
              sideOffset={4}
              // Prevents focusing on the trigger when closing
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", duration: 0.4 },
                }}
                exit={{
                  scale: 0.4,
                  opacity: 0,
                  transition: { type: "spring", duration: 0.2 },
                }}
                className="w-48 origin-top-right rounded-md border border-gray-200 bg-bg-light-100 shadow-lg"
              >
                <DropdownMenu.Item asChild>
                  <NavLink inMenu href="/about">
                    About
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink inMenu href="/tutorial">
                    Tutorial
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <NavLink inMenu external href="https://admlu65.ust.hk">
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
