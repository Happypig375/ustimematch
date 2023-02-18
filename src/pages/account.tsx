import { IconLogout } from "@tabler/icons-react";
import clsx from "clsx";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "@components/Header";
import Migrate from "@components/Migrate";
import Button from "@components/ui/Button";
import Google from "@components/ui/account/AccountGoogle";
import IconGoogle from "@components/ui/account/IconGoogle";
import { prisma } from "../server/db/client";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user)
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  return {
    props: {
      user,
      accounts,
    },
  };
};

const Account = ({
  user,
  accounts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    setSigningOut(true);
    const { url } = await signOut({
      callbackUrl: "/auth/signout",
      redirect: false,
    });
    router.push(url);
  };

  // Link/unlink Google account
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onLinkGoogle = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/account" });
  };

  const providers = accounts.map((account) => account.provider);

  return (
    <Header>
      <div className="grid w-full place-items-center overflow-auto p-6">
        <div
          className={clsx(
            "prose prose-sm w-full max-w-md",
            "sm:prose-base",
            "dark:prose-invert",
            "prose-hr:border-border-100",
          )}
        >
          <h3>Signed in as</h3>
          <p>{user.email}</p>

          {/* OAuth accounts */}
          <div
            className={clsx(
              "flex flex-col gap-4",
              accounts.length === 0 && "hidden",
            )}
          >
            {accounts.map(
              (account) =>
                account.provider === "google" && (
                  <Google key={account.id} account={account} />
                ),
            )}
          </div>

          <hr />

          <div className="flex flex-wrap gap-4 self-center text-base">
            {!providers.includes("google") && (
              <Button
                fullWidth
                className="text-base"
                onClick={onLinkGoogle}
                loading={isGoogleLoading}
                disabled={isGoogleLoading}
              >
                <IconGoogle className="h-5 w-5" />
                Link with Google
              </Button>
            )}

            <Migrate />

            <Button
              fullWidth
              onClick={onSignOut}
              loading={signingOut}
              disabled={signingOut}
            >
              <IconLogout strokeWidth={1.75} className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Account;
