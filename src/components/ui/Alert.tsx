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
              forceMount
              exit="close"
              animate="open"
              initial="close"
              variants={modalOverlayVariants}
              className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-bg-light-200/40 py-4"
            >
              <MotionAlertContent
                ref={ref}
                forceMount
                exit="close"
                animate="open"
                initial="close"
                variants={modalVariants}
                className="w-[95%] overflow-auto rounded-xl bg-bg-light-100 p-6 shadow-xl sm:w-[clamp(450px,45%,500px)]"
              >
                <div className="flex flex-col gap-4">{children}</div>
              </MotionAlertContent>
            </MotionAlertOverlay>
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
    className="text-xl font-semibold leading-none"
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
    className="text-sm leading-none text-text-black-100"
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
