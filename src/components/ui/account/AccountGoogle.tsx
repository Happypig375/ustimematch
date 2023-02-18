import type { Account } from "@prisma/client";
import { IconLinkOff, IconX } from "@tabler/icons-react";
import jwt_decode from "jwt-decode";
import type { GoogleProfile } from "next-auth/providers/google";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Alert,
  AlertCancel,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "@components/ui/Alert";
import Button from "@components/ui/Button";
import IconGoogle from "@components/ui/account/IconGoogle";
import { trpc } from "@utils/trpc";

const Google = ({ account }: { account: Account }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.auth.unlinkAccount.useMutation();

  const [unlinking, setUnlinking] = useState(false);
  const [openUnlinkAlert, setOpenUnlinkAlert] = useState(false);

  const onUnlinkGoogle = async () => {
    setUnlinking(true);

    await mutateAsync({ id: account.id });

    // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    router.replace(router.asPath);

    setUnlinking(false);
    setOpenUnlinkAlert(false);
  };

  return (
    <div className="flex items-center gap-4 rounded-md border border-border-100 p-4">
      <IconGoogle className="h-5 w-5" />

      <span className="text-sm leading-tight">
        Linked with Google as
        <br />
        <span className="text-xs">
          {account.id_token &&
            jwt_decode<GoogleProfile>(account.id_token).email}
        </span>
      </span>

      <Alert
        open={openUnlinkAlert}
        onOpenChange={(open) => !unlinking && setOpenUnlinkAlert(open)}
      >
        <AlertTrigger asChild>
          <Button icon plain error className="ml-auto">
            <IconLinkOff strokeWidth={1.75} className="h-5 w-5" />
          </Button>
        </AlertTrigger>

        <AlertContent open={openUnlinkAlert}>
          <AlertTitle>Are you sure?</AlertTitle>

          <AlertDescription>
            You won&apos;t be able to sign in with Google after unlinking. To
            access your account, please sign in with email.
          </AlertDescription>

          <div className="flex gap-2">
            <AlertCancel asChild>
              <Button fullWidth disabled={unlinking}>
                <IconX strokeWidth={1.75} className="h-5 w-5" />
                Cancel
              </Button>
            </AlertCancel>

            <Button
              error
              fullWidth
              loading={unlinking}
              disabled={unlinking}
              onClick={onUnlinkGoogle}
            >
              <IconLinkOff strokeWidth={1.75} className="h-5 w-5" />
              Unlink
            </Button>
          </div>
        </AlertContent>
      </Alert>
    </div>
  );
};

export default Google;
