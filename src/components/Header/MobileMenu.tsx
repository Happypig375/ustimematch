import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import NavLink from "@ui/NavLink";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        {/* Unable to use IconButton component (forwardRef problem) */}
        <button
          aria-label="Open navigation menu"
          className="rounded-md border border-gray-200 p-2 hover:border-gray-300 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-blue-400 sm:hidden"
        >
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content forceMount asChild align="end" sideOffset={4}>
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
                className="w-52 origin-top-right rounded-md border border-gray-200 bg-bg-light-100 shadow-lg"
              >
                <DropdownMenu.Item className="rounded-tl-md rounded-tr-md hover:bg-bg-light-200">
                  <NavLink inMenu href="/about">
                    About
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-[1px] w-full bg-gray-200" />

                <DropdownMenu.Item className="hover:bg-bg-light-200">
                  <NavLink inMenu href="/tutorial">
                    Tutorial
                  </NavLink>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-[1px] w-full bg-gray-200" />

                <DropdownMenu.Item className="rounded-bl-md rounded-br-md hover:bg-bg-light-200">
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
