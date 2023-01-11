import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { forwardRef } from "react";
import { tabsVariants } from "./variants";

interface TabsContentProps extends TabsPrimitive.TabsContentProps {
  tabsValue: string;
  direction: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, tabsValue, direction, ...props }, ref) => (
    <AnimatePresence initial={false} mode="popLayout">
      {tabsValue === value && (
        <TabsPrimitive.Content
          ref={ref}
          value={value}
          asChild
          {...props}
          forceMount
        >
          <motion.div
            exit="exit"
            animate="enter"
            initial="exit"
            variants={tabsVariants}
            custom={direction}
          >
            {children}
          </motion.div>
        </TabsPrimitive.Content>
      )}
    </AnimatePresence>
  ),
);
TabsContent.displayName = "TabsContent";

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  TabsPrimitive.TabsTriggerProps
>(({ children, className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    {...props}
    className={clsx("text-lg font-medium leading-none", className)}
  >
    {children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

export const Tabs = forwardRef<HTMLDivElement, TabsPrimitive.TabsProps>(
  ({ children, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} {...props}>
      <LayoutGroup>{children}</LayoutGroup>
    </TabsPrimitive.Root>
  ),
);
Tabs.displayName = "Tabs";

export const TabsList = TabsPrimitive.TabsList;
