import { IconShare } from "@tabler/icons";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@ui/Button";
import { Modal, ModalContent, ModalTitle, ModalTrigger } from "@ui/Modal";
import { Tabs, TabsContent } from "@ui/Tabs";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
import SelectTab from "./SelectTab";
import ShareTab from "./ShareTab";

const Share = () => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [tabsValue, setTabsValue] = useState<"select" | "share">("select");

  const [shareURL, setShareURL] = useState<string>("");

  useEffect(() => {
    if (openShareModal) return;
    setCheckedIds([]);
    setTabsValue("select");
  }, [openShareModal]);

  const { mutate, isLoading: _ } = trpc.share.guestShare.useMutation({
    onSuccess: ({ slug, expiresAt: _ }) => {
      setTabsValue("share");
      setShareURL(`${window.origin}/share/${slug}`);
      setCheckedIds([]);
    },
    onError: () => {
      toast.error("Unable to share selected timetables due to unknown error");
      setCheckedIds([]);
    },
  });

  const onContinue = (timetables: Timetable[]) => {
    mutate({ timetables });
    // setTabsValue("share");
  };

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
              onContinue={onContinue}
            />
          </TabsContent>

          <TabsContent tabsValue={tabsValue} value="share" direction="right">
            <ShareTab setTabsValue={setTabsValue} shareURL={shareURL} />
          </TabsContent>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default Share;
