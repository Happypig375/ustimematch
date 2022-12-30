import { Inter } from "@next/font/google";
import { IconX } from "@tabler/icons";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import Button from "@ui/Button";
import { trpc } from "@utils/trpc";
import useMediaQuery from "../hooks/useMediaQuery";
import "../styles/globals.css";

const inter = Inter();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const matchDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <SessionProvider session={session}>
      <Head>
        <title>USTimematch</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          name="description"
          content="HKUST Timetable utilities, share and store timetables, search for common time slots, and more to come!"
        />
      </Head>

      <main className={inter.className}>
        <Component {...pageProps} />
      </main>

      <Toaster
        position={matchDesktop ? "bottom-right" : "top-right"}
        toastOptions={{
          error: {
            className: "border-red-400 border-l-[6px]",
            duration: 5000,
          },
          success: {
            className: "border-emerald-400 border-l-[6px]",
            duration: 5000,
          },
          blank: {
            duration: 5000,
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {/* eslint-disable-next-line */}
            {({ icon, message }) => (
              <>
                {message}
                {t.type !== "loading" && (
                  <Button onClick={() => toast.dismiss(t.id)} icon plain>
                    <IconX />
                  </Button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
