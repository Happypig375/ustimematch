import { IconArrowBack, IconCheck, IconCopy, IconX } from "@tabler/icons";
import { QRCodeCanvas } from "qrcode.react";
import type { Dispatch, SetStateAction } from "react";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { ModalClose, ModalControl } from "@ui/Modal";

interface Props {
  setTabsValue: Dispatch<SetStateAction<"select" | "share">>;
}

const ShareTab = ({ setTabsValue }: Props) => {
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex flex-col gap-2">
        <QRCodeCanvas
          // includeMargin
          value="testasdfffffasdffffffffffffffffffasdfffffffff"
          // className="h-64 w-64 self-center rounded-xl"
          className="self-center"
          size={192}
        />

        <div className="flex gap-2">
          <Input
            readOnly
            value="https://www.ustimematch.com/share/123"
            className="flex-grow"
            // onClick={selectUrl}
            // ref={readOnlyInputRef}
            // className="bg-bg-light-3 flex-grow rounded-md px-3"
          />
          <Button title="Copy share link" icon>
            {true ? (
              <IconCopy stroke={1.75} className="h-5 w-5" />
            ) : (
              <IconCheck stroke={1.75} className="h-5 w-5 text-emerald-500" />
            )}
          </Button>
        </div>
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
