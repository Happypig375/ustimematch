import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Header from "@components/Header";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

const ZSignInForm = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" }),
});

type SignInForm = z.infer<typeof ZSignInForm>;

const SignIn = () => {
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
    <Header>
      <div className="relative grid w-full place-items-center p-6">
        <div
          className={clsx(
            "prose prose-sm",
            "sm:prose-base",
            "dark:prose-invert",
          )}
        >
          <h2>Sign in to USTimematch</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[80vw] flex-col gap-4 sm:w-96"
            data-cy="sign-in-form"
          >
            <Input
              id="email"
              label="Email"
              labelId="email"
              inputMode="email"
              {...register("email")}
              disabled={isLoading}
              error={errors.email?.message}
              tips="A sign in link will be sent to you via email."
              data-cy="sign-in-form-email-input"
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
        </div>
      </div>
    </Header>
  );
};

export default SignIn;
