import { IconMoonStars, IconSunHigh } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Button from "@components/ui/Button";
import { themeVariants } from "@components/ui/variants";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      icon
      title={`Toggle ${theme === "light" ? "Dark" : "Light"} Mode`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      // relative is needed to prevent popLayout jumping
      className="relative dark:hover:shadow-[0_0_16px_4px_#1e40af40] dark:active:shadow-[0_0_16px_4px_#1e40af40]"
      data-cy="theme-toggle"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {theme === "light" && (
          <motion.div
            key="light"
            exit="exit"
            initial="exit"
            animate="enter"
            variants={themeVariants}
          >
            <IconSunHigh strokeWidth={1.75} className="h-5 w-5" />
          </motion.div>
        )}
        {theme === "dark" && (
          <motion.div
            key="dark"
            exit="exit"
            initial="exit"
            animate="enter"
            variants={themeVariants}
          >
            <IconMoonStars strokeWidth={1.75} className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default ThemeToggle;
