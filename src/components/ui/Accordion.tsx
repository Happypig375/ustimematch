import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";
import { accordionVariants, chevronVariants } from "./variants";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionItemProps
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Item className={clsx(className)} ref={ref} {...props}>
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
        "flex h-10 w-full items-center justify-between rounded-md border border-border-gray-100 p-4 text-text-black-100 transition-all",
        "active:bg-bg-light-200",
        "hover:border-border-gray-200 hover:text-text-black-200",
        className,
      )}
    >
      {children}

      <motion.div
        initial={false}
        animate={value ? "close" : "open"}
        variants={chevronVariants}
      >
        <IconChevronDown stroke={1.75} className="h-5 w-5" />
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
