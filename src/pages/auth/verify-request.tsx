import { useRouter } from "next/router";
import Header from "@components/Header";
import Button from "@components/ui/Button";

const VerifyRequest = () => {
  const router = useRouter();

  return (
    <Header>
      <div className="grid w-full place-items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl">Please Check your email</h1>
          <span>A sign in link has been sent to your email address.</span>
          <Button fullWidth onClick={() => router.replace("/")}>
            Return to home page
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default VerifyRequest;
