import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { motion, type PanInfo, AnimatePresence } from "framer-motion";
import { type DetailedHTMLProps, forwardRef, type HTMLAttributes } from "react";
import {
  drawerVariants,
  modalVariants,
  drawerOverlayVariants,
  modalOverlayVariants,
} from "@ui/variants";
import useMediaQuery from "@hooks/useMediaQuery";

const MotionDialogContent = motion(DialogPrimitive.Content);
const MotionDialogOverlay = motion(DialogPrimitive.Overlay);

interface ModalContentProps extends DialogPrimitive.DialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const matchDesktop = useMediaQuery("(min-width: 640px)");

    const onDragEnd = (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (
        info.velocity.y > 500 ||
        info.point.y > window.innerHeight - window.innerHeight / 10
      )
        onOpenChange(false);
    };

    return (
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <MotionDialogOverlay
              forceMount
              exit="close"
              animate="open"
              initial="close"
              // BUG: transparency background will change opacity when dragging drawer to bottom on iOS
              // FIX: drawer background color is now handled in variants
              variants={
                matchDesktop ? modalOverlayVariants : drawerOverlayVariants
              }
              className="fixed inset-0 z-50 grid place-items-end sm:place-items-center sm:overflow-auto sm:bg-bg-light-200/40 sm:py-4"
            >
              <MotionDialogContent
                asChild
                ref={ref}
                {...props}
                forceMount
                exit="close"
                animate="open"
                initial="close"
                variants={matchDesktop ? modalVariants : drawerVariants}
                drag={matchDesktop ? undefined : "y"}
                dragSnapToOrigin
                // @ts-expect-error: wrong type
                onDragEnd={onDragEnd}
                dragTransition={{ bounceStiffness: 800, bounceDamping: 60 }}
                // BUG: dragElastic does not work, cannot constrain drag to only bottom direction
                // dragElastic={{ top: 0, bottom: 0.5 }}
              >
                {matchDesktop ? (
                  <div className="flex w-[clamp(475px,50%,525px)] flex-col gap-4 rounded-xl bg-bg-light-100 p-6 shadow-xl">
                    {children}
                  </div>
                ) : (
                  <div className="w-[100vw] rounded-t-xl bg-bg-light-100 shadow-drawer">
                    {/* Drag handler */}
                    <div className="my-4">
                      <div className="mx-auto h-[6px] w-14 rounded-full bg-bg-light-400" />
                    </div>

                    <div
                      className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-6 pb-6"
                      // Prevent drag unless on drag handler
                      onPointerDownCapture={(e) => e.stopPropagation()}
                    >
                      {children}
                    </div>
                  </div>
                )}
              </MotionDialogContent>
            </MotionDialogOverlay>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    );
  },
);
ModalContent.displayName = "ModalContent";

export const ModalTitle = forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.DialogTitleProps
>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={clsx("text-xl font-semibold leading-none", className)}
    ref={ref}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = forwardRef<
  HTMLParagraphElement,
  DialogPrimitive.DialogDescriptionProps
>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={clsx("text-lg font-medium leading-none", className)}
    ref={ref}
    {...props}
  >
    {children}
  </DialogPrimitive.Description>
));
ModalDescription.displayName = "ModalDescription";

export const ModalControl = forwardRef<
  HTMLDivElement,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div className={clsx("flex gap-2", className)} ref={ref} {...props}>
    {children}
  </div>
));
ModalControl.displayName = "ModalControl";

/**
 * High level abstraction of Radix UI's Dialog component.
 *
 * Provide styles and animations for texts, mobile drawer, and desktop modal.
 *
 * @example
 * <Modal open={open} onOpenChange={setOpen}>
 *   <ModalTrigger asChild>
 *     <buttton>Trigger</button>
 *   </ModalTrigger>
 *
 *   <ModalContent open={open} onOpenChange={setOpen}>
 *     <ModalTitle>Title/ModalTitle>
 *
 *     <ModalDescription>Description</ModalDescription>
 *
 *     <div>Main Content</div>
 *
 *     <ModalControl>
 *       <ModalClose asChild>
 *         <buttton>Cancel</button>
 *       </ModalClose>
 *       <ModalClose asChild>
 *         <buttton>Submit</button>
 *       </ModalClose>
 *     </ModalControl>
 *   </ModalContent>
 * </Modal>
 */
export const Modal = DialogPrimitive.Root;
export const ModalClose = DialogPrimitive.Close;
export const ModalTrigger = DialogPrimitive.Trigger;
