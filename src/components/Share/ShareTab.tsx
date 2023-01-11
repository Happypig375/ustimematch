import { IconArrowBack, IconCheck, IconCopy, IconX } from "@tabler/icons";
import { QRCodeCanvas } from "qrcode.react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { ModalClose, ModalControl } from "@ui/Modal";

interface Props {
  shareURL: string;
  setTabsValue: Dispatch<SetStateAction<"select" | "share">>;
}

const ShareTab = ({ shareURL, setTabsValue }: Props) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const copyURL = () => {
    if (copied) clearTimeout(timeoutRef.current);

    navigator.clipboard && navigator.clipboard.writeText(shareURL);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const selectURL = () => {
    inputRef.current?.select();
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <QRCodeCanvas
        size={192}
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
        <Button icon title="Copy share link" onClick={copyURL}>
          {copied ? (
            <IconCheck stroke={1.75} className="h-5 w-5 text-emerald-500" />
          ) : (
            <IconCopy stroke={1.75} className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ModalControl>
        <Button fullWidth onClick={() => setTabsValue("select")}>
          <IconArrowBack stroke={1.75} className="h-5 w-5" />
          Back
        </Button>

        <ModalClose asChild>
          <Button fullWidth>
            <IconX stroke={1.75} className="h-5 w-5" />
            Close
          </Button>
        </ModalClose>
      </ModalControl>
    </div>
  );
};

export default ShareTab;
