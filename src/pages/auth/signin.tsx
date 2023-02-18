import clsx from "clsx";
import SignInForm from "@components/Form/SignInForm";
import Header from "@components/Header";

const SignIn = () => {
  return (
    <Header>
      <div className="grid w-full place-items-center overflow-auto p-6">
        <div
          className={clsx(
            "prose prose-sm w-[80vw]",
            "sm:w-96 sm:prose-base",
            "dark:prose-invert",
          )}
        >
          <h2 className="!mb-8">Sign in to USTimematch</h2>

          <SignInForm />

          <p className="!mt-8 text-sm">
            Tips: To migrate locally saved timetables, visit the Account page
            after signing in.
          </p>
        </div>
      </div>
    </Header>
  );
};

export default SignIn;
