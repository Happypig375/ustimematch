import * as FocusScope from "@radix-ui/react-focus-scope";
import type { PopoverContentProps, StepType } from "@reactour/tour";
import { TourProvider, useTour } from "@reactour/tour";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { actions, useTrackedStore } from "@store/index";
import { defaultTimetableStore, timetableStore } from "@store/timetable";
import { uiStore } from "@store/ui";
import demo from "../assets/demo.json";
import Button from "./ui/Button";

const ContentComponent = ({
  currentStep,
  setCurrentStep,
  setIsOpen,
  steps,
  onClickClose,
}: PopoverContentProps) => {
  const { theme } = useTheme();

  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, [currentStep]);

  const step = steps[currentStep];
  if (!step || typeof step.content === "function") return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Mix --bg-100 with #000000 with 40% opacity */}
      {/* http://origin.filosophy.org/code/online-tool-to-lighten-color-without-alpha-channel/ */}
      <Head>
        {theme === "light" && <meta name="theme-color" content="#969696" />}
        {theme === "dark" && <meta name="theme-color" content="#0c0c0c" />}
      </Head>

      <FocusScope.Root
        loop
        trapped
        onMountAutoFocus={(e) => e.preventDefault()}
      >
        <div
          tabIndex={-1}
          ref={focusRef}
          className="flex max-w-xs flex-col rounded-md bg-bg-200 p-2 shadow-elevation focus-visible:outline-none sm:max-w-sm"
          data-cy="tour-modal"
        >
          <div
            className={clsx(
              "px-4 py-2",
              "prose prose-sm",
              "sm:prose-base",
              "dark:prose-invert",
            )}
          >
            {step.content}
          </div>
          <div className="flex gap-2">
            <Button
              plain
              title="Skip Tour"
              className="mr-auto"
              onClick={() =>
                onClickClose?.({ currentStep, setCurrentStep, setIsOpen })
              }
              data-cy="tour-skip"
            >
              Skip
            </Button>

            {currentStep !== 0 && (
              <Button
                icon
                title="Previous Step"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                data-cy="tour-prev"
              >
                <IconArrowLeft strokeWidth={1.75} className="h-5 w-5" />
              </Button>
            )}

            <Button
              title="Next Step"
              data-cy="tour-next"
              icon={!isLastStep}
              onClick={() => {
                if (isLastStep) {
                  onClickClose?.({ currentStep, setCurrentStep, setIsOpen });
                } else {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
            >
              {isLastStep ? (
                "Start!"
              ) : (
                <IconArrowRight strokeWidth={1.75} className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </FocusScope.Root>
    </>
  );
};

const Controller = () => {
  const { setIsOpen } = useTour();
  const showTour = useTrackedStore().ui.showTour();

  useEffect(() => {
    if (showTour) setIsOpen(true);
  }, [setIsOpen, showTour]);

  return null;
};

const Tour = () => {
  const router = useRouter();
  const session = useSession();
  // Keep a copy of timetable store (for restoring authenticated store)
  const [prevTimetableStore] = useState(timetableStore.get.state());

  const handleClose = useCallback(() => {
    uiStore.set.showTour(false);

    // Scroll back to explorer
    document
      .querySelector("[data-tour='explorer-controls']")
      ?.scrollIntoView({ behavior: "smooth" });

    // Restore timetable store
    if (session.status === "unauthenticated")
      actions.timetable.enableLocalStorage();

    if (session.status === "authenticated")
      timetableStore.set.state(() => prevTimetableStore);
  }, [prevTimetableStore, session.status]);

  useEffect(() => {
    const handleUnload = () => uiStore.set.showTour(false);

    router.events.on("routeChangeStart", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      router.events.off("routeChangeStart", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [router.events]);

  const steps: StepType[] = [
    {
      selector: "[data-tour='explorer-controls']",
      content: (
        <>
          <p>Thanks for trying out USTimematch!</p>
          <p>Here you can manually add timetables, folders and share them.</p>
        </>
      ),
      action: () => {
        // Prevent states changes from persisting
        if (session.status === "unauthenticated")
          actions.timetable.disableLocalStorage();

        // Reset states
        uiStore.set.showTimematch(false);
        timetableStore.set.state(() => defaultTimetableStore);
      },
    },
    {
      selector: "[data-tour='personal-timetable']",
      position: "top",
      content: (
        <p>And here&apos;s a special place for your personal timetable.</p>
      ),
      // Demo timetable store
      action: () => timetableStore.set.state(() => demo),
    },
    {
      selector: "[data-tour='weekview-controls']",
      content: (
        <p>
          Here you can toggle timematch, weekend, update timetables and switch
          between light/dark mode.
        </p>
      ),
      // Showcase timematch
      action: () => uiStore.set.showTimematch(true),
      actionAfter: () => uiStore.set.showTimematch(false),
    },
    {
      selector: "[data-tour='weekview']",
      position: ({ left }) => [left - 4, 0],
      content: (
        <>
          <p>Finally, timetables will be shown here.</p>
          <p>
            For detailed instructions, please refer to the{" "}
            <Link href="/tutorial">tutorial</Link> page.
          </p>
        </>
      ),
    },
  ];

  return (
    <TourProvider
      padding={4}
      steps={steps}
      // disableInteraction
      scrollSmooth
      ContentComponent={ContentComponent}
      className="!max-w-[calc(100%-8px)] !bg-transparent !py-2 !px-0 !shadow-none"
      onClickClose={({ setIsOpen }) => {
        setIsOpen(false);
        handleClose();
      }}
      // @ts-expect-error Wrong type
      Wrapper={({ children }: { children: ReactNode }) =>
        createPortal(children, document.body)
      }
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClickMask={() => {}}
      styles={{
        maskArea: (styles) => ({
          ...styles,
          rx: 6,
        }),
        maskWrapper: (styles) => ({
          ...styles,
          opacity: 0.4,
        }),
      }}
    >
      <Controller />
    </TourProvider>
  );
};

export default Tour;
