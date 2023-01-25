import { IconShare } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import { Modal, ModalContent, ModalTrigger } from "@components/ui/Modal";
import { TabsContent, TabsRoot } from "@components/ui/Tabs";
import { trpc } from "@utils/trpc";
import type { Timetable } from "../../types/timetable";
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

  const { data, mutate, isLoading, isError } =
    trpc.share.guestShare.useMutation({ retry: false });

  const onContinue = (timetables: Timetable[]) => {
    setCheckedIds([]);
    setTabsValue("share");
    mutate({ timetables });
  };

  return (
    <Modal
      open={openShareModal}
      onOpenChange={isLoading ? undefined : setOpenShareModal}
    >
      <ModalTrigger asChild>
        <Button icon title="Share" onClick={() => setOpenShareModal(true)}>
          <IconShare strokeWidth={1.75} className="h-5 w-5" />
        </Button>
      </ModalTrigger>

      <ModalContent open={openShareModal} onOpenChange={setOpenShareModal}>
        <TabsRoot value={tabsValue}>
          <TabsContent value="select" custom={{ direction: "left" }}>
            <SelectTab
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              onContinue={onContinue}
            />
          </TabsContent>

          <TabsContent value="share" custom={{ direction: "right" }}>
            <ShareTab
              isError={isError}
              isLoading={isLoading}
              setTabsValue={setTabsValue}
              shareURL={
                data ? `${window.origin}/?share=${data.slug}` : undefined
              }
              expiresAt={
                data
                  ? data.expiresAt.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : undefined
              }
            />
          </TabsContent>
        </TabsRoot>
      </ModalContent>
    </Modal>
  );
};

export default Share;
