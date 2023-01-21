import clsx from "clsx";
import { useRouter } from "next/router";
import Header from "@components/Header";
import Button from "@components/ui/Button";

const VerifyRequest = () => {
  const router = useRouter();

  return (
    <Header>
      <div className="grid w-full place-items-center p-6">
        <article
          className={clsx(
            "prose prose-sm mx-auto",
            "sm:prose-base",
            "dark:prose-invert",
          )}
        >
          <h2>Please check your email</h2>
          <p>A sign in link has been sent to your email address.</p>
          <Button
            fullWidth
            onClick={() => router.replace("/")}
            className="text-base"
          >
            Return to Home Page
          </Button>
        </article>
      </div>
    </Header>
  );
};

export default VerifyRequest;
