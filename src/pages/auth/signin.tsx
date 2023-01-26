import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import type { CtxOrReq } from "next-auth/client/_utils";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Header from "@components/Header";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

export const getServerSideProps = async (context: CtxOrReq) => {
  const session = await getSession(context);
  const user = session?.user;

  if (user)
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

const ZSignInForm = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" }),
});

type SignInForm = z.infer<typeof ZSignInForm>;

const SignIn = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<SignInForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ZSignInForm),
  });

  const onSubmit: SubmitHandler<SignInForm> = async ({ email }) => {
    const data = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
    });
    data?.error && toast.error("Sign in failed, please try again later.");
    data?.url && router.push(data.url);
  };

  useEffect(() => {
    reset({
      email: "",
    });
  }, [reset, isSubmitSuccessful]);

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
              disabled={isSubmitting}
              error={errors.email?.message}
              tips="A sign in link will be sent to you via email."
              data-cy="sign-in-form-email-input"
            />
            <Button
              fullWidth
              type="submit"
              className="text-base"
              loading={isSubmitting}
              disabled={isSubmitting}
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
