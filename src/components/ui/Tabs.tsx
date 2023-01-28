import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { TabsCustom } from "./variants";
import { tabsVariants } from "./variants";

interface TabsContentProps extends TabsPrimitive.TabsContentProps {
  custom: TabsCustom;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, custom, ...props }, ref) => (
    <TabsPrimitive.Content asChild ref={ref} value={value} {...props}>
      <motion.div
        initial={false}
        animate="enter"
        custom={custom}
        variants={tabsVariants}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
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
    className={clsx("text-lg font-medium", className)}
  >
    {children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsRoot = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.TabsList;
