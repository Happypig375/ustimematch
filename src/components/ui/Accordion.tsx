import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { IconChevronDown } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { accordionVariants, chevronVariants } from "./motion/variants";

export const AccordionRoot = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  open: boolean;
}

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ children, className, open, ...props }, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={clsx(
      "flex h-10 w-full items-center justify-between rounded-md p-4 transition-focusable",
      "border border-border-100 bg-bg-200 text-fg-100",
      "hover:border-border-200 hover:text-fg-200",
      "active:border-border-200 active:bg-bg-300 active:text-fg-200",
      open && "text-fg-200",
      className,
    )}
    {...props}
  >
    {children}

    <m.div
      initial={false}
      variants={chevronVariants}
      animate={open ? "close" : "open"}
    >
      <IconChevronDown strokeWidth={1.75} className="h-5 w-5" />
    </m.div>
  </AccordionPrimitive.Trigger>
));

AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps
  extends AccordionPrimitive.AccordionContentProps {
  open: boolean;
}

export const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ children, className, open, ...props }, ref) => (
  <AnimatePresence initial={false}>
    {open && (
      <AccordionPrimitive.Content ref={ref} asChild forceMount {...props}>
        <m.div
          exit="close"
          animate="open"
          initial="close"
          variants={accordionVariants}
          className={clsx("overflow-hidden px-4", className)}
        >
          {children}
        </m.div>
      </AccordionPrimitive.Content>
    )}
  </AnimatePresence>
));

AccordionContent.displayName = "AccordionContent";
