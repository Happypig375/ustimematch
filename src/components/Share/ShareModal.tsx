import { IconShare } from "@tabler/icons";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@components/ui/Button";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@components/ui/Modal";
import { Tabs, TabsContent } from "@components/ui/Tabs";
import Tips from "@components/ui/Tips";
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

  const { data, mutate, isLoading } = trpc.share.guestShare.useMutation({
    onSuccess: ({ slug, expiresAt }) => {
      setTabsValue("share");
      setShareURL(`${window.origin}/?share=${slug}`);
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
        <Tabs value={tabsValue}>
          <TabsContent tabsValue={tabsValue} value="select" direction="left">
            <SelectTab
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              onContinue={onContinue}
            />
          </TabsContent>

          {data && (
            <TabsContent tabsValue={tabsValue} value="share" direction="right">
              <ShareTab
                setTabsValue={setTabsValue}
                shareURL={`${window.origin}/?share=${data.slug}`}
                expiresAt={data.expiresAt.toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              />
            </TabsContent>
          )}
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default Share;
