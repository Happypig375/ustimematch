import * as Popover from "@radix-ui/react-popover";
import { IconInfoCircle } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import Button from "./Button";
import { tipsVariants } from "./motion/variants";

interface Props extends HTMLAttributes<HTMLDivElement> {
  triggerClassName?: string;
  image?: boolean;
}

const Tips = ({ children, image, className, triggerClassName }: Props) => {
  const [openTips, setOpenTips] = useState(false);

  return (
    <Popover.Root open={openTips} onOpenChange={setOpenTips}>
      <Popover.Trigger asChild>
        <Button
          icon
          plain
          title={`${openTips ? "Close" : "Open"} Tips`}
          className={clsx("!h-5 !w-5 rounded-full", triggerClassName)}
        >
          <IconInfoCircle strokeWidth={1.75} className="h-4 w-4" />
        </Button>
      </Popover.Trigger>

      <AnimatePresence>
        {openTips && (
          <Popover.Portal forceMount>
            <Popover.Content
              forceMount
              asChild
              side="top"
              sideOffset={6}
              collisionPadding={6}
            >
              <m.div
                exit="close"
                animate="open"
                initial="close"
                variants={tipsVariants}
                className={clsx(
                  "z-50 origin-[var(--radix-popover-content-transform-origin)] rounded-md bg-bg-200 text-sm shadow-elevation focus-visible:outline-none",
                  image ? "rounded-lg p-1" : "w-64 px-4 py-2",
                  className,
                )}
              >
                {children}
              </m.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};

export default Tips;
