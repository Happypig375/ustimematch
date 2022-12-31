import { type Variants } from "framer-motion";

// Mobile dropdown menu (fade)
export const menuVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.4,
    },
  },
  close: {
    scale: 0,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.4,
    },
  },
};

// Explorer panel (slide)
export const explorerVariants: Variants = {
  open: {
    marginLeft: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 2,
    },
  },
  close: {
    // Matching tailwind's "min-w-[256px] w-1/5"
    marginLeft: "min(-256px, -20%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 2,
    },
  },
};

// Toggle explorer button icon (rotate)
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

// Drawer drag (slide)
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

// Drawer backdrop (fade)
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

// Modal (fade)
export const modalVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.2,
    },
  },
  close: {
    scale: 0.96,
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.2,
    },
  },
};

// Modal backdrop (fade)
export const modalOverlayVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.2,
    },
  },
  close: {
    opacity: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.2,
    },
  },
};
