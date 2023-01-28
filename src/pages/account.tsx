import clsx from "clsx";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "@components/Header";
import Button from "@components/ui/Button";
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

  return {
    props: {
      user,
    },
  };
};

const Account = ({
  user,
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

  return (
    <Header>
      <div className="grid w-full place-items-center p-6">
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

          <hr />

          <div className="flex flex-wrap gap-4 self-center text-base">
            <Button
              fullWidth
              onClick={onSignOut}
              loading={signingOut}
              disabled={signingOut}
            >
              Sign Out
            </Button>

            {/* <Button fullWidth>Export Data</Button> */}
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Account;
