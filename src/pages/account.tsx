import clsx from "clsx";
import type { InferGetServerSidePropsType } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import { getSession, signOut } from "next-auth/react";
import Header from "@components/Header";
import Button from "@components/ui/Button";

export const getServerSideProps = async (context: CtxOrReq) => {
  const session = await getSession(context);
  const user = session?.user;

  if (!user)
    return {
      redirect: {
        destination: "/api/auth/signin",
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
  return (
    <Header>
      <div className="grid w-full place-items-center p-6">
        <article
          className={clsx(
            "prose prose-sm mx-auto",
            "sm:prose-base",
            "dark:prose-invert",
            "prose-hr:border-border-100",
          )}
        >
          <h3>Signed in as</h3>
          <p>{user.email}</p>
          {/* <h3>Shared links</h3>
          <table>
            <thead>
              <tr>
                <th>Link</th>
                <th>Expires At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  https://www.ustimematch.com/?share=hkgJm8E-zyhQ4Dv4KdoRx
                </td>
                <td>1 Jan 2022, 09:00 am</td>
              </tr>
            </tbody>
          </table> */}
          <hr />
          <div className="flex flex-wrap gap-4 self-center text-base">
            <Button
              fullWidth
              onClick={() => signOut({ callbackUrl: "/auth/signout" })}
            >
              Sign Out
            </Button>
            <Button fullWidth disabled>
              Export Data
            </Button>
            <Button fullWidth error disabled>
              Delete Account
            </Button>
          </div>
        </article>
      </div>
    </Header>
  );
};

export default Account;
