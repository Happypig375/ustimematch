import Accordion, { AccordionContent, AccordionTrigger } from "@ui/Accordion";
import Button from "@ui/Button";
import {
  Modal,
  ModalContent,
  ModalControl,
  ModalDescription,
  ModalTitle,
} from "@ui/Modal";
import { DialogClose } from "@radix-ui/react-dialog";
import { parseUSTName } from "@utils/parseName";
import { getPathAdvisorUrl } from "@utils/pathAdvisor";
import { parseTime } from "@utils/time";
import { useContext, useState } from "react";
import { WeekViewContext } from "./Context";
import { AccordionItem } from "@radix-ui/react-accordion";

const DetailsModal = () => {
  const { openDetails, setOpenDetails, detailsTimetable, detailsLesson } =
    useContext(WeekViewContext);

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

        <div className="flex flex-col gap-2 leading-tight">
          <div>
            {`${parseTime(detailsLesson.begin)}
             - ${parseTime(detailsLesson.end)}`}
          </div>

          <div>{detailsLesson.venue || "TBA"}</div>

          <Accordion
            type="single"
            collapsible
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
        </div>

        <ModalControl>
          {/* TODO: anchor tag? */}
          {detailsTimetable.university === "HKUST" && detailsLesson.venue && (
            <Button
              fullWidth
              onClick={() =>
                window.open(getPathAdvisorUrl(detailsLesson.venue), "_blank")
              }
            >
              Path Advisor
            </Button>
          )}

          <DialogClose asChild>
            <Button fullWidth>Close</Button>
          </DialogClose>
        </ModalControl>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
