import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { m, type PanInfo, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Head from "next/head";
import {
  type DetailedHTMLProps,
  forwardRef,
  type HTMLAttributes,
  useRef,
} from "react";
import {
  drawerVariants,
  modalVariants,
  drawerOverlayVariants,
  modalOverlayVariants,
} from "@components/ui/motion/variants";
import useMediaQuery from "@hooks/useMediaQuery";

const MotionDialogContent = m(DialogPrimitive.Content);
const MotionDialogOverlay = m(DialogPrimitive.Overlay);

interface ModalContentProps extends DialogPrimitive.DialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const { theme } = useTheme();
    const matchDesktop = useMediaQuery("(min-width: 640px)");

    const focusRef = useRef<HTMLDivElement>(null);

    const onDragEnd = (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (
        info.velocity.y > 200 ||
        info.point.y > window.innerHeight - window.innerHeight / 10
      )
        onOpenChange(false);
    };

    return (
      <>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <MotionDialogOverlay
                forceMount
                exit="close"
                animate="open"
                initial="close"
                // BUG: animating opacity causes the modal to be transparnt, but opacity is already 1.
                // Should be a framer motion bug.
                variants={
                  matchDesktop ? modalOverlayVariants : drawerOverlayVariants
                }
                className="fixed inset-0 z-50 grid place-items-end bg-bg-200/40 sm:place-items-center sm:py-4"
              >
                {/* Mix --bg-100 with --bg-200 with 40% opacity */}
                {/* http://origin.filosophy.org/code/online-tool-to-lighten-color-without-alpha-channel/ */}
                <Head>
                  {theme === "light" && (
                    <meta name="theme-color" content="#f9f9f9" />
                  )}
                  {theme === "dark" && (
                    <meta name="theme-color" content="#151515" />
                  )}
                </Head>

                <MotionDialogContent
                  asChild
                  ref={ref}
                  {...props}
                  onOpenAutoFocus={(e) => {
                    // Prevents weird bugs with input focusing
                    e.preventDefault();
                    // Instead focus on modal for trapping focus
                    focusRef.current?.focus();
                  }}
                  forceMount
                  exit="close"
                  animate="open"
                  initial="close"
                  // Constrains drag to negative y axis only
                  dragSnapToOrigin
                  dragMomentum={false}
                  dragElastic={{ top: 0 }}
                  dragConstraints={{ top: 0 }}
                  // @ts-expect-error: wrong type
                  onDragEnd={onDragEnd}
                  drag={matchDesktop ? undefined : "y"}
                  variants={matchDesktop ? modalVariants : drawerVariants}
                  dragTransition={{ bounceStiffness: 800, bounceDamping: 60 }}
                >
                  {matchDesktop ? (
                    <div
                      ref={focusRef}
                      className="flex max-h-[80vh] w-[clamp(475px,50%,525px)] flex-col gap-4 overflow-y-auto rounded-xl bg-bg-200 p-6 shadow-elevation focus-visible:outline-none"
                    >
                      {children}
                    </div>
                  ) : (
                    <div
                      ref={focusRef}
                      className="w-[100vw] rounded-t-xl bg-bg-200 shadow-elevation focus-visible:outline-none"
                    >
                      {/* Drag handler */}
                      <div className="my-4">
                        <div className="mx-auto h-[6px] w-14 rounded-full bg-fg-100/10" />
                      </div>

                      <div
                        className="focus-visible-ring flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-6 pb-6"
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
      </>
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
 *     <ModalTitle>Title</ModalTitle>
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
