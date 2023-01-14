import { IconX } from "@tabler/icons";
import { useTheme } from "next-themes";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import Button from "./ui/Button";

const Toast = () => {
  const { theme } = useTheme();
  return (
    // BUG: doesn't have prop for e.stopPropagation, clicking on toast will click through
    <Toaster
      position="top-right"
      toastOptions={{
        error: {
          className: "border-red-500 border-l-[6px]",
          duration: 10000,
        },
        success: {
          className: "border-emerald-500 border-l-[6px]",
          duration: 5000,
        },
        blank: {
          duration: 5000,
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            backgroundColor:
              theme === "light" ? "rgb(var(--bg-100))" : "rgb(var(--bg-200))",
            color: "rgb(var(--fg-200))",
            boxShadow: "var(--shadow-elevation)",
          }}
        >
          {({ icon: _, message }) => (
            <>
              {message}
              {t.type !== "loading" && (
                <Button onClick={() => toast.dismiss(t.id)} icon plain>
                  <IconX />
                </Button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default Toast;
