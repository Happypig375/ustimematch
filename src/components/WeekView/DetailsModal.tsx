import { AccordionItem } from "@radix-ui/react-accordion";
import { IconRoute, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import {
  AccordionRoot,
  AccordionContent,
  AccordionTrigger,
} from "@components/ui/Accordion";
import Button from "@components/ui/Button";
import {
  Modal,
  ModalContent,
  ModalControl,
  ModalDescription,
  ModalTitle,
  ModalClose,
} from "@components/ui/Modal";
import { actions, useTrackedStore } from "@store/index";
import { parseUSTName } from "@utils/parseName";
import { getPathAdvisorUrl } from "@utils/pathAdvisor";
import { time12 } from "@utils/time";

const DetailsModal = () => {
  const openDetails = useTrackedStore().weekView.openDetails();
  const detailsTimetable = useTrackedStore().weekView.detailsTimetable();
  const detailsLesson = useTrackedStore().weekView.detailsLesson();
  const setOpenDetails = actions.weekView.setOpenDetails;

  const [value, setValue] = useState("");

  if (!detailsTimetable || !detailsLesson) return null;

  const showPathAdvisor = !!(
    detailsTimetable.university === "HKUST" && detailsLesson.venue
  );

  return (
    <Modal open={openDetails} onOpenChange={setOpenDetails}>
      <ModalContent
        open={openDetails}
        onOpenChange={setOpenDetails}
        // Prevents focusing on button
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ModalTitle className="flex justify-between">
          <div>{parseUSTName(detailsLesson.name).lessonName}</div>
          <div>{parseUSTName(detailsLesson.name).section}</div>
        </ModalTitle>

        <ModalDescription>{detailsTimetable.name}</ModalDescription>

        <div className="flex flex-col gap-2 leading-none">
          <div>
            {`${time12(detailsLesson.begin)}
             - ${time12(detailsLesson.end)}`}
          </div>

          {detailsLesson.venue && <div>{detailsLesson.venue}</div>}
        </div>

        <ModalControl className="flex-col">
          <AccordionRoot
            collapsible
            type="single"
            value={value}
            onValueChange={setValue}
          >
            <AccordionItem value="description">
              <AccordionTrigger open={value === "description"}>
                Description
              </AccordionTrigger>
              <AccordionContent
                open={value === "description"}
                className="whitespace-pre-wrap leading-relaxed"
              >
                <p className="pt-1">{detailsLesson.description}</p>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>

          {/* Calcualte flex-basis with gap to make their width equal, otherwise Link will be squashed. */}
          {/* TODO: maybe a better way to handle this? */}
          <div className="flex gap-2">
            {showPathAdvisor && (
              <Link
                target="_blank"
                className="basis-[calc(50%-4px)] rounded-md"
                href={getPathAdvisorUrl(detailsLesson.venue)}
              >
                <Button fullWidth tabIndex={-1}>
                  <IconRoute strokeWidth={1.75} className="h-5 w-5" />
                  Path Advisor
                </Button>
              </Link>
            )}

            <ModalClose asChild>
              <Button
                fullWidth={!showPathAdvisor}
                className={clsx(showPathAdvisor && "basis-[calc(50%-4px)]")}
              >
                <IconX strokeWidth={1.75} className="h-5 w-5" />
                Close
              </Button>
            </ModalClose>
          </div>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
