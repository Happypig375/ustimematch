import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { forwardRef } from "react";
import { modalVariants, modalOverlayVariants } from "@ui/variants";

const MotionAlertOverlay = motion(AlertDialogPrimitive.Overlay);
const MotionAlertContent = motion(AlertDialogPrimitive.Content);

interface AlertContentProps extends AlertDialogPrimitive.DialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(
  ({ children, open, onOpenChange }, ref) => {
    return (
      <AnimatePresence>
        {open && (
          <AlertDialogPrimitive.Portal forceMount>
            <MotionAlertOverlay
              className="fixed inset-0 bg-zinc-200/40"
              exit="close"
              animate="open"
              initial="close"
              variants={modalOverlayVariants}
              forceMount
            />

            <MotionAlertContent
              forceMount
              exit="close"
              animate="open"
              initial="close"
              variants={modalVariants}
              className={clsx(
                "fixed overflow-auto bg-bg-light-100 shadow-xl",
                "inset-0 flex items-center justify-center bg-transparent shadow-none",
              )}
              onClick={() => onOpenChange(false)}
              ref={ref}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[80vh] w-[95%] overflow-auto rounded-xl bg-bg-light-100 p-6 shadow-xl sm:w-[clamp(450px,45%,500px)]"
              >
                {children}
              </div>
            </MotionAlertContent>
          </AlertDialogPrimitive.Portal>
        )}
      </AnimatePresence>
    );
  },
);
AlertContent.displayName = "AlertContent";

export const AlertTitle = forwardRef<
  HTMLHeadingElement,
  AlertDialogPrimitive.AlertDialogTitleProps
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    className="text-xl font-semibold"
    ref={ref}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Title>
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogPrimitive.AlertDialogDescriptionProps
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    className="text-sm text-text-black-100"
    ref={ref}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Description>
));
AlertDescription.displayName = "AlertDescription";

/**
 * High level abstraction of Radix UI's Alert Dialog component.
 *
 * Provide styles and animations for texts, mobile drawer, and desktop modal.
 *
 * Useage is same as Modal component
 */
export const Alert = AlertDialogPrimitive.Root;
export const AlertTrigger = AlertDialogPrimitive.Trigger;
export const AlertCancel = AlertDialogPrimitive.Cancel;
export const AlertAction = AlertDialogPrimitive.Action;
