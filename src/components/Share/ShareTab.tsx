import { IconArrowBack, IconCheck, IconCopy, IconX } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import type { Dispatch, SetStateAction } from "react";
import { forwardRef } from "react";
import { useRef, useState } from "react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { ModalClose, ModalControl, ModalTitle } from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import { short } from "@components/ui/variants";

interface Props {
  shareURL?: string;
  expiresAt?: string;
  isLoading: boolean;
  isError: boolean;
  setTabsValue: Dispatch<SetStateAction<"select" | "share">>;
}

const ShareTab = forwardRef<HTMLDivElement, Props>(
  ({ shareURL, expiresAt, setTabsValue, isLoading, isError }, ref) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const inputRef = useRef<HTMLInputElement>(null);

    const copyURL = () => {
      if (copied) clearTimeout(timeoutRef.current);

      shareURL &&
        navigator.clipboard &&
        navigator.clipboard.writeText(shareURL);
      setCopied(true);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    const selectURL = () => inputRef.current?.select();

    return (
      <div className="flex flex-col justify-center gap-4" ref={ref}>
        <div className="flex justify-between">
          <ModalTitle>Share</ModalTitle>
          {expiresAt && (
            <span className="text-sm">Expires at: {expiresAt}</span>
          )}
        </div>

        {isLoading && (
          <div className="grid h-64 place-items-center">
            <Spinner />
          </div>
        )}

        {isError && (
          <span className="grid h-64 place-items-center text-red-500">
            Failed to share selected timetables.
          </span>
        )}

        {shareURL && (
          <motion.div
            transition={short}
            animate={{ opacity: [0, 1] }}
            className="flex flex-col gap-2"
          >
            <QRCodeCanvas
              // Matching h-64
              size={208}
              value={shareURL}
              className="self-center rounded-2xl border-[16px] border-white"
            />

            <div className="flex gap-2">
              <Input
                readOnly
                ref={inputRef}
                value={shareURL}
                className="flex-grow"
                onClick={selectURL}
              />
              <Button icon title="Copy Share Link" onClick={copyURL}>
                {copied ? (
                  <IconCheck
                    strokeWidth={1.75}
                    className="h-5 w-5 text-emerald-500"
                  />
                ) : (
                  <IconCopy strokeWidth={1.75} className="h-5 w-5" />
                )}
              </Button>
            </div>
          </motion.div>
        )}

        <ModalControl>
          <Button
            fullWidth
            onClick={() => setTabsValue("select")}
            disabled={isLoading}
          >
            <IconArrowBack strokeWidth={1.75} className="h-5 w-5" />
            Back
          </Button>

          <ModalClose asChild>
            <Button fullWidth disabled={isLoading}>
              <IconX strokeWidth={1.75} className="h-5 w-5" />
              Close
            </Button>
          </ModalClose>
        </ModalControl>
      </div>
    );
  },
);
ShareTab.displayName = "ShareTab";

export default ShareTab;
