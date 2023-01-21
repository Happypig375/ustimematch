import clsx from "clsx";
import type { InferGetServerSidePropsType } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "@components/Header";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

export async function getServerSideProps(context: CtxOrReq) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <Header>
      <div className="relative grid w-full place-items-center p-6">
        <article
          className={clsx(
            "prose prose-sm mx-auto",
            "sm:prose-base",
            "dark:prose-invert",
          )}
        >
          <h2>Sign in to USTimematch</h2>
          <form
            method="post"
            action="/api/auth/signin/email"
            className="flex w-[80vw] flex-col gap-4 sm:w-96"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <Input
              inputMode="email"
              id="email"
              labelId="email"
              label="Email"
              name="email"
              error={
                typeof error === "string" ? "Failed to sign in" : undefined
              }
              tips="A sign in link will be sent to you via email."
            />
            <Button type="submit" fullWidth className="text-base">
              Sign in
            </Button>
          </form>
        </article>
      </div>
    </Header>
  );
};

export default SignIn;
