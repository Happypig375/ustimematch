import { usePrevious } from "@dnd-kit/utilities";
import {
  IconArrowBack,
  IconArrowForward,
  IconBoxMargin,
  IconChecklist,
  IconListCheck,
  IconShare,
  IconX,
} from "@tabler/icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "@ui/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalControl,
  ModalTitle,
  ModalTrigger,
} from "@ui/Modal";
import { Tabs, TabsContent } from "@ui/Tabs";
import SelectTab from "./SelectTab";
import ShareTab from "./ShareTab";

const Share = () => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [tabsValue, setTabsValue] = useState<"select" | "share">("select");

  useEffect(() => {
    if (openShareModal) return;
    setCheckedIds([]);
    setTabsValue("select");
  }, [openShareModal]);

  return (
    <Modal open={openShareModal} onOpenChange={setOpenShareModal}>
      <ModalTrigger asChild>
        <Button icon title="Share" onClick={() => setOpenShareModal(true)}>
          <IconShare stroke={1.75} className="h-5 w-5" />
        </Button>
      </ModalTrigger>

      <ModalContent open={openShareModal} onOpenChange={setOpenShareModal}>
        <ModalTitle>Share</ModalTitle>

        <Tabs value={tabsValue}>
          <TabsContent tabsValue={tabsValue} value="select" direction="left">
            <SelectTab
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              setTabsValue={setTabsValue}
            />
          </TabsContent>

          <TabsContent tabsValue={tabsValue} value="share" direction="right">
            <ShareTab setTabsValue={setTabsValue} />
          </TabsContent>
        </Tabs>

        {/* <ModalControl>
          {tabsValue === "select" && (
            <Button icon onClick={toggleCheck}>
              <IconListCheck stroke={1.75} className="h-5 w-5" />
            </Button>
          )}

          {tabsValue === "share" && (
            <Button fullWidth onClick={() => setTabsValue("select")}>
              <IconArrowBack stroke={1.75} className="h-5 w-5" />
              Back
            </Button>
          )}

          <ModalClose asChild>
            <Button fullWidth>
              <IconX stroke={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>

          {tabsValue === "select" && (
            <Button
              fullWidth
              onClick={() => setTabsValue("share")}
              // disabled={checkedIds.length === 0}
            >
              <IconArrowForward stroke={1.75} className="h-5 w-5" />
              Continue
            </Button>
          )}
        </ModalControl> */}
      </ModalContent>
    </Modal>
  );
};

export default Share;
