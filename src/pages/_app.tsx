import { IBM_Plex_Sans } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import Toast from "@components/Toast";
import { actions, store } from "@store/index";
import { trpc } from "@utils/trpc";
import "../styles/globals.css";

const IBMPlexSans = IBM_Plex_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Used for cypress testing zustand store
  useEffect(() => {
    // @ts-expect-error window type
    if (typeof window !== undefined && window.Cypress) {
      // @ts-expect-error window type
      window.store = store;
      // @ts-expect-error window type
      window.actions = actions;
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        enableSystem={false}
        disableTransitionOnChange
        attribute="class"
      >
        <Head>
          <title>USTimematch</title>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <meta
            name="description"
            content="HKUST Timetable utilities, share and store timetables, search for common time slots, and more to come!"
          />
        </Head>

        {/* https://github.com/vercel/next.js/discussions/42023 */}
        <style jsx global>{`
          :root {
            --font-ibm-plex-sans: ${IBMPlexSans.style.fontFamily};
          }
        `}</style>

        <Toast />

        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
