import { AccordionItem } from "@radix-ui/react-accordion";
import { IconRoute, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import Accordion, {
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
import { parseTime } from "@utils/time";

const DetailsModal = () => {
  const openDetails = useTrackedStore().weekView.openDetails();
  const detailsTimetable = useTrackedStore().weekView.detailsTimetable();
  const detailsLesson = useTrackedStore().weekView.detailsLesson();
  const setOpenDetails = actions.weekView.setOpenDetails;

  const [value, setValue] = useState("");

  if (!detailsTimetable || !detailsLesson) return null;

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
            {`${parseTime(detailsLesson.begin)}
             - ${parseTime(detailsLesson.end)}`}
          </div>

          {detailsLesson.venue && <div>{detailsLesson.venue}</div>}
        </div>

        <ModalControl className="flex-col">
          <Accordion
            collapsible
            type="single"
            value={value}
            onValueChange={setValue}
          >
            <AccordionItem value="description">
              <AccordionTrigger value={value}>Description</AccordionTrigger>
              <AccordionContent
                value={value}
                className="whitespace-pre-wrap leading-relaxed"
              >
                <p className="pt-1">{detailsLesson.description}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-2">
            {detailsTimetable.university === "HKUST" && detailsLesson.venue && (
              <Link
                target="_blank"
                className="w-full"
                href={getPathAdvisorUrl(detailsLesson.venue)}
              >
                <Button fullWidth>
                  <IconRoute strokeWidth={1.75} className="h-5 w-5" />
                  Path Advisor
                </Button>
              </Link>
            )}

            <ModalClose asChild>
              <Button fullWidth>
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
