import clsx from "clsx";
import SignInForm from "@components/Form/SignInForm";
import Header from "@components/Header";

const SignIn = () => {
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
          <SignInForm />
        </div>
      </div>
    </Header>
  );
};

export default SignIn;
