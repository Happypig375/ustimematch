import * as Popover from "@radix-ui/react-popover";
import { IconInfoCircle } from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import Button from "./Button";
import { tipsVariants } from "./variants";

const Tips = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  const [openTips, setOpenTips] = useState(false);

  return (
    <Popover.Root open={openTips} onOpenChange={setOpenTips}>
      <Popover.Trigger asChild>
        <Button icon plain className="!h-5 !w-5 rounded-full">
          <IconInfoCircle stroke={1.75} className="h-4 w-4" />
        </Button>
      </Popover.Trigger>

      <AnimatePresence>
        {openTips && (
          <Popover.Portal forceMount>
            <Popover.Content forceMount asChild side="top" sideOffset={6}>
              <motion.div
                exit="close"
                animate="open"
                initial="close"
                variants={tipsVariants}
                className="z-50 w-52 origin-[var(--radix-popover-content-transform-origin)] rounded-md bg-bg-200 px-4 py-2 text-sm shadow-elevation"
              >
                {children}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};

export default Tips;
