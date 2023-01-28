import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { IconChevronDown } from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";
import { accordionVariants, chevronVariants } from "./variants";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionItemProps
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} {...props}>
    {children}
  </AccordionPrimitive.Item>
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.AccordionTriggerProps
>(({ children, className, value, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      {...props}
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-md p-4 transition-focusable",
        "border border-border-100 bg-bg-200 text-fg-100",
        "hover:border-border-200 hover:text-fg-200",
        "active:bg-bg-300 active:text-fg-200",
        className,
      )}
    >
      {children}

      <motion.div
        initial={false}
        animate={value ? "close" : "open"}
        variants={chevronVariants}
      >
        <IconChevronDown strokeWidth={1.75} className="h-5 w-5" />
      </motion.div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps
  extends AccordionPrimitive.AccordionContentProps {
  value: string;
}

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, value, ...props }, ref) => (
  <AnimatePresence initial={false}>
    {value && (
      <AccordionPrimitive.Content ref={ref} {...props} forceMount>
        <motion.div
          exit="close"
          animate="open"
          initial="close"
          variants={accordionVariants}
          className={clsx("overflow-hidden px-4", className)}
        >
          {children}
        </motion.div>
      </AccordionPrimitive.Content>
    )}
  </AnimatePresence>
));
AccordionContent.displayName = "AccordionContent";

export default Accordion;
