import type { Transition, Variants } from "framer-motion";

export const LONG_IN_MS = 400;
export const MEDIUM_IN_MS = 300;
export const SHORT_IN_MS = 200;

export const LONG_IN_SEC = 0.4;
export const MEDIUM_IN_SEC = 0.3;
export const SHORT_IN_SEC = 0.2;

export const long: Transition = {
  type: "spring",
  bounce: 0,
  duration: LONG_IN_SEC,
};

export const medium: Transition = {
  type: "spring",
  bounce: 0,
  duration: MEDIUM_IN_SEC,
};

export const short: Transition = {
  type: "spring",
  bounce: 0,
  duration: SHORT_IN_SEC,
};

// Toggle theme button
export const themeVariants: Variants = {
  enter: {
    opacity: 1,
    rotate: 360,
    transition: long,
  },
  exit: {
    rotate: 0,
    opacity: 0,
    transition: long,
  },
};

// Mobile dropdown menu
export const menuVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: short,
  },
  close: {
    scale: 0.3,
    opacity: 0,
    transition: short,
  },
};

// Tips popover
export const tipsVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: short,
  },
  close: {
    scale: 0.3,
    opacity: 0,
    transition: short,
  },
};

// Explorer panel
export const explorerVariants: Variants = {
  open: {
    marginLeft: 0,
    transition: long,
  },
  close: {
    // Matching tailwind's "min-w-[256px] w-1/5"
    marginLeft: "min(-256px, -20%)",
    transition: long,
  },
};

// Chevron 180 deg
export const chevronVariants: Variants = {
  open: {
    rotate: 0,
    transition: long,
  },
  close: {
    rotate: 180,
    transition: long,
  },
};

// Chevron 90 deg
export const chevronHalfVariants: Variants = {
  open: {
    rotate: 0,
    transition: long,
  },
  close: {
    rotate: -90,
    transition: long,
  },
};

// Accordion
export const accordionVariants: Variants = {
  open: {
    height: "var(--radix-accordion-content-height)",
    opacity: 1,
    transition: long,
  },
  close: {
    height: 0,
    opacity: 0,
    transition: long,
  },
};

// Drawer
export const drawerVariants: Variants = {
  open: {
    y: 0,
    transition: medium,
  },
  close: {
    y: "100%",
    transition: medium,
  },
};

// Drawer backdrop
export const drawerOverlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: medium,
  },
  close: {
    opacity: 0,
    transition: medium,
  },
};

// Modal
export const modalVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: medium,
  },
  close: {
    scale: 0.95,
    opacity: 0,
    transition: medium,
  },
};

// Modal backdrop
export const modalOverlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: medium,
  },
  close: {
    opacity: 0,
    transition: medium,
  },
};

// Tabs
export interface TabsCustom {
  direction: "left" | "right";
}

export const tabsVariants: Variants = {
  enter: ({ direction }: TabsCustom) => ({
    x: [direction === "left" ? -24 : 24, 0],
    opacity: [0, 1],
    transition: long,
  }),
};
