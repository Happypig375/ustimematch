import { IBM_Plex_Sans } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { LazyMotion } from "framer-motion";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
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

const ThemeColorHandler = () => {
  const { theme } = useTheme();

  return (
    <Head>
      {/* --bg-100 */}
      {theme === "light" && <meta name="theme-color" content="#fafafa" />}
      {theme === "dark" && <meta name="theme-color" content="#141414" />}
    </Head>
  );
};

const App: AppType<{ session: Session | null }> = ({
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
        <LazyMotion
          strict
          features={async () =>
            (await import("@components/ui/motion/features")).default
          }
        >
          <Head>
            <title>USTimematch</title>

            <link rel="icon" href="favicon.png" />

            <meta
              name="description"
              content="Timetable manager for HKUST students."
            />

            <meta property="og:title" content="USTimematch" />
            <meta
              property="og:description"
              content="Timetable manager for HKUST students."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.ustimematch.com" />
            <meta property="og:image" content="" />
          </Head>

          {/* https://github.com/vercel/next.js/discussions/42023 */}
          <style jsx global>{`
            :root {
              --font-ibm-plex-sans: ${IBMPlexSans.style.fontFamily};
            }
          `}</style>

          <Toast />

          <ThemeColorHandler />

          <NextNProgress
            height={2}
            startPosition={0.2}
            color="rgb(var(--fg-200))"
            options={{ showSpinner: false, speed: 200 }}
          />

          <Analytics
            beforeSend={(event) => {
              // Remove all query params
              const url = new URL(event.url);
              for (const [key] of url.searchParams.entries())
                url.searchParams.set(key, "REDACTED");
              return {
                ...event,
                url: url.toString(),
              };
            }}
          />

          <Component {...pageProps} />
        </LazyMotion>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
