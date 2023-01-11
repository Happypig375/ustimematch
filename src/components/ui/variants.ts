import { type Variants } from "framer-motion";

// Mobile dropdown menu
export const menuVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
  close: {
    scale: 0.3,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Explorer panel
export const explorerVariants: Variants = {
  open: {
    marginLeft: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  close: {
    // Matching tailwind's "min-w-[256px] w-1/5"
    marginLeft: "min(-256px, -20%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

// Chevron 180 deg
export const chevronVariants: Variants = {
  open: {
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  close: {
    rotate: 180,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

// Chevron 90 deg
export const chevronHalfVariants: Variants = {
  open: {
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  close: {
    rotate: -90,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

// Accordion
export const accordionVariants: Variants = {
  open: {
    height: "var(--radix-accordion-content-height)",
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  close: {
    height: 0,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

// Drawer
export const drawerVariants: Variants = {
  open: {
    y: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
  close: {
    y: "100%",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Drawer backdrop
export const drawerOverlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
  close: {
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Modal
export const modalVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
  close: {
    scale: 0.95,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Modal backdrop
export const modalOverlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
  close: {
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Tabs
export const tabsVariants: Variants = {
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  exit: (direction: string) => ({
    x: direction === "left" ? "-20px" : "20px",
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  }),
};
