import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import * as Separator from "@radix-ui/react-separator";
import { IconAlertCircle, IconMail } from "@tabler/icons-react";
import clsx from "clsx";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import IconGoogle from "@components/ui/account/IconGoogle";
import { env } from "../../env/client.mjs";

const ZSignInForm = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" }),
});

type SignInForm = z.infer<typeof ZSignInForm>;

const SignInForm = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [isError, setIsError] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [cfTurnstileResponse, setCfTurnstileResponse] = useState("");

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: { email: "" },
    resolver: zodResolver(ZSignInForm),
  });

  const onSubmit: SubmitHandler<SignInForm> = async ({ email }) => {
    if (!cfTurnstileResponse) return;

    // Clear previous query params in case there are any errors
    router.replace("/auth/signin");
    setIsEmailLoading(true);

    const data = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
      "cf-turnstile-response": cfTurnstileResponse,
    });
    data?.error && setIsError(true);
    if (data?.url) return router.push(data.url);

    setIsEmailLoading(false);
    reset({ email: "" });
  };

  const onSignInGoogle = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      {/* Safari input zoom workaround, specifically applied to this page. */}
      {/* https://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari */}
      <Head>
        {typeof navigator !== "undefined" &&
          /iPad|iPhone|iPod/.test(navigator.userAgent) && (
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
          )}
      </Head>

      <div className="grid w-full place-items-center overflow-auto p-6">
        <div
          className={clsx(
            "prose prose-sm w-[80vw]",
            "sm:w-[400px] sm:prose-base",
            "dark:prose-invert",
          )}
        >
          <h2 className="!mb-12">Sign in to USTimematch</h2>

          <form
            data-cy="sign-in-form"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              id="email"
              label="Email"
              inputMode="email"
              {...register("email")}
              error={errors.email?.message}
              disabled={isEmailLoading || isGoogleLoading}
              tips="A sign in link will be sent to you via email."
            />

            <Button
              fullWidth
              type="submit"
              className="mb-6 text-base"
              loading={isEmailLoading}
              disabled={
                isEmailLoading || isGoogleLoading || !cfTurnstileResponse
              }
            >
              <IconMail strokeWidth={1.75} className="h-5 w-5" />
              Sign in with email
            </Button>
          </form>

          <div className="mb-6 flex items-center gap-4">
            <Separator.Root
              decorative
              orientation="horizontal"
              className="h-[1px] w-full bg-border-200"
            />
            <span className="text-sm">OR</span>
            <Separator.Root
              decorative
              orientation="horizontal"
              className="h-[1px] w-full bg-border-200"
            />
          </div>

          <Button
            fullWidth
            className="mb-6 text-base"
            onClick={onSignInGoogle}
            loading={isGoogleLoading}
            disabled={isEmailLoading || isGoogleLoading || !cfTurnstileResponse}
          >
            <IconGoogle className="h-5 w-5" />
            Sign in with Google
          </Button>

          <Turnstile
            className="mb-6"
            onSuccess={setCfTurnstileResponse}
            onError={() => setCfTurnstileResponse("")}
            onExpire={() => setCfTurnstileResponse("")}
            siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
            options={{ theme: theme === "light" ? "light" : "dark" }}
          />

          {(isError || typeof router.query.error === "string") && (
            <p className="flex items-center gap-2 text-sm text-red-500">
              <IconAlertCircle
                strokeWidth={1.75}
                className="h-5 w-5 flex-shrink-0"
              />

              {router.query.error === "OAuthAccountNotLinked"
                ? "An account is already associated with this email. Please sign in and visit the Account page to link it with your Google account."
                : "Something went wrong, please try again later."}
            </p>
          )}

          <p className="!mt-12 text-sm">
            Tips: To migrate locally saved timetables, visit the Account page
            after signing in.
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
