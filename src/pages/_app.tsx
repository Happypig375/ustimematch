import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { Inter } from "@next/font/google";
import "../styles/globals.css";

const inter = Inter();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
