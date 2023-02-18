import { IconTrash, IconX } from "@tabler/icons-react";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import {
  Alert,
  AlertAction,
  AlertCancel,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "@components/ui/Alert";
import Button from "@components/ui/Button";

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  hidden?: boolean;
  disabled?: boolean;
  onDelete: () => void;
}

const DeleteAlert = ({ hidden, disabled, onDelete, children }: Props) => {
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Alert open={openAlert} onOpenChange={setOpenAlert}>
      {!hidden && (
        <AlertTrigger asChild>
          <Button
            icon
            error
            title="Delete"
            type="button"
            onClick={() => setOpenAlert(true)}
            data-cy="delete-alert-trigger"
            disabled={disabled}
          >
            <IconTrash strokeWidth={1.75} className="h-5 w-5" />
          </Button>
        </AlertTrigger>
      )}

      <AlertContent open={openAlert}>
        <AlertTitle>Are you sure?</AlertTitle>

        <AlertDescription>{children}</AlertDescription>

        <div className="flex gap-2">
          <AlertCancel asChild>
            <Button fullWidth>
              <IconX strokeWidth={1.75} className="h-5 w-5" />
              Cancel
            </Button>
          </AlertCancel>

          <AlertAction asChild>
            <Button
              error
              fullWidth
              onClick={() => {
                setOpenAlert(false);
                onDelete();
              }}
              data-cy="delete-alert-delete"
            >
              <IconTrash strokeWidth={1.75} className="h-5 w-5" />
              Delete
            </Button>
          </AlertAction>
        </div>
      </AlertContent>
    </Alert>
  );
};

export default DeleteAlert;
