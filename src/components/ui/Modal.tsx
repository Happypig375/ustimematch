import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  drawerVariants,
  modalVariants,
  drawerOverlayVariants,
  modalOverlayVariants,
} from "@ui/variants";
import clsx from "clsx";
import { motion, type PanInfo, AnimatePresence } from "framer-motion";
import { type DetailedHTMLProps, forwardRef, type HTMLAttributes } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

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
        info.velocity.y > 1000 ||
        info.point.y > window.innerHeight - window.innerHeight / 10
      )
        onOpenChange(false);
    };

    const Content = () => (
      <div
        className="flex flex-col gap-4"
        // Prevent drag unless on drag handler
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    );

    return (
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <MotionDialogOverlay
              className="fixed inset-0 bg-zinc-200/60"
              exit="close"
              animate="open"
              initial="close"
              variants={
                matchDesktop ? modalOverlayVariants : drawerOverlayVariants
              }
              forceMount
            />

            <MotionDialogContent
              drag={matchDesktop ? undefined : "y"}
              // @ts-expect-error: wrong type
              onDragEnd={onDragEnd}
              dragSnapToOrigin
              dragTransition={{ bounceStiffness: 800, bounceDamping: 60 }}
              // dragElastic does not work, cannot constrain drag to only bottom direction
              // dragElastic={{ top: 0, bottom: 0.5 }}
              forceMount
              exit="close"
              animate="open"
              initial="close"
              variants={matchDesktop ? modalVariants : drawerVariants}
              className={clsx(
                "fixed bg-bg-light-100 shadow-xl",
                // Mobile drawer styles
                "inset-x-0 bottom-0 rounded-t-xl",
                // Desktop modal styles
                "sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-transparent sm:shadow-none",
                // Dirty fix for showing drawer background color while dragging up (will affect animation)
                // "-bottom-[2000px] border-b-[2000px] border-bg-light-100 sm:border-b-0 sm:border-none",
                // Dirty fix for disabling upward drag (will cause flicker)
                // offset < 0 && "!translate-y-0",
              )}
              onClick={matchDesktop ? () => onOpenChange(false) : undefined}
              ref={ref}
              {...props}
            >
              {matchDesktop ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-[clamp(500px,50%,600px)] rounded-xl bg-bg-light-100 p-6 shadow-xl"
                >
                  <Content />
                </div>
              ) : (
                <>
                  {/* Drag handler */}
                  <div className="my-4">
                    <div className="mx-auto h-[6px] w-14 rounded-full bg-gray-100" />
                  </div>

                  <div className="px-6 pb-6">
                    <Content />
                  </div>
                </>
              )}
            </MotionDialogContent>
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
>(({ children, ...props }, ref) => (
  <DialogPrimitive.Title className="text-xl font-semibold" ref={ref} {...props}>
    {children}
  </DialogPrimitive.Title>
));
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = forwardRef<
  HTMLParagraphElement,
  DialogPrimitive.DialogDescriptionProps
>(({ children, ...props }, ref) => (
  <DialogPrimitive.Description
    className="text-lg font-medium"
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
>(({ children, ...props }, ref) => (
  <div className="flex gap-2" ref={ref} {...props}>
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
 *       <DialogClose asChild>
 *         <buttton>Cancel</button>
 *       </DialogClose>
 *       <DialogClose asChild>
 *         <buttton>Submit</button>
 *       </DialogClose>
 *     </ModalControl>
 *   </ModalContent>
 * </Modal>
 */
export const Modal = DialogPrimitive.Root;
export const ModalClose = DialogPrimitive.Close;
export const ModalTrigger = DialogPrimitive.Trigger;
