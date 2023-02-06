import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

const ZSignInForm = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" }),
});

type SignInForm = z.infer<typeof ZSignInForm>;

const SignInForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInForm>({
    defaultValues: { email: "" },
    resolver: zodResolver(ZSignInForm),
  });

  const onSubmit: SubmitHandler<SignInForm> = async ({ email }) => {
    setIsLoading(true);
    const data = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
    });
    data?.error && toast.error("Sign in failed, please try again later.");
    if (data?.url) return router.push(data.url);

    setIsLoading(false);
    reset({ email: "" });
  };

  return (
    <>
      {/* A workaround for input zoom on safari, only applying to this page. */}
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        data-cy="sign-in-form"
      >
        <Input
          id="email"
          label="Email"
          inputMode="email"
          {...register("email")}
          disabled={isLoading}
          error={errors.email?.message}
          tips="A sign in link will be sent to you via email."
        />
        <Button
          fullWidth
          type="submit"
          className="text-base"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign in
        </Button>
      </form>
    </>
  );
};

export default SignInForm;
