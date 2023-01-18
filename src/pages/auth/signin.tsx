import { zodResolver } from "@hookform/resolvers/zod";
import type { InferGetServerSidePropsType } from "next";
import type { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "@components/Header";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

const ZSignInForm = z.object({
  csrfToken: z.string().min(1),
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" }),
});

type SignInForm = z.infer<typeof ZSignInForm>;

export async function getServerSideProps(context: CtxOrReq) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    register,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: {
      csrfToken,
      email: "",
    },
    resolver: zodResolver(ZSignInForm),
  });

  return (
    <Header>
      <div className="grid w-full place-items-center">
        <form
          method="post"
          action="/api/auth/signin/email"
          className="flex w-80 flex-col gap-4"
        >
          <input type="hidden" {...register("csrfToken")} />
          <Input
            inputMode="email"
            id="email"
            labelId="email"
            label="Email"
            error={errors?.email?.message}
            {...register("email")}
          />
          <Button type="submit" fullWidth>
            Sign in
          </Button>
        </form>
      </div>
    </Header>
  );
};

export default SignIn;
