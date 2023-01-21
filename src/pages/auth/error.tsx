import clsx from "clsx";
import { useRouter } from "next/router";
import Header from "@components/Header";
import Button from "@components/ui/Button";

const Error = () => {
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
          <h2>Oops! Something went wrong.</h2>
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

export default Error;
