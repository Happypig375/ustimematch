import { IconX } from "@tabler/icons-react";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import Button from "./ui/Button";

const Toast = () => {
  return (
    // BUG: doesn't have prop for e.stopPropagation, clicking on toast will click through
    <Toaster
      position="top-right"
      toastOptions={{
        error: {
          className: "border-red-500 border-l-4",
          duration: 10000,
        },
        success: {
          className: "border-emerald-500 border-l-4",
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
            color: "rgb(var(--fg-200))",
            boxShadow: "var(--shadow-elevation)",
            backgroundColor: "rgb(var(--bg-200))",
          }}
        >
          {({ icon: _, message }) => (
            <>
              {message}
              {t.type !== "loading" && (
                <Button
                  icon
                  plain
                  title="Dismiss Toast"
                  onClick={() => toast.dismiss(t.id)}
                >
                  <IconX strokeWidth={1.75} className="h-5 w-5" />
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
