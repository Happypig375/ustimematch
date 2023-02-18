import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextApiHandler } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { SendVerificationRequestParams } from "next-auth/providers/email";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { createTransport } from "nodemailer";
import renderEmailSignIn from "../../../emails/EmailSignIn";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const ONE_MINUTE_IN_MS = 60000;
const ONE_DAY_IN_MS = 86400000;

const ONE_DAY_IN_SECONDS = 86400;
const HALF_YEAR_IN_SECONDS = 15552000;

async function isRateLimited(email: string) {
  // The expected expires date
  const expires = new Date(new Date().getTime() + ONE_DAY_IN_MS);

  // Count of verification token within one minute
  const count = await prisma.verificationToken.count({
    where: {
      identifier: { equals: email },
      AND: [
        { expires: { gt: new Date(expires.getTime() - ONE_MINUTE_IN_MS) } },
        { expires: { lt: expires } },
      ],
    },
  });

  // Maximum 2 requests per minute
  return count > 1;
}

// Adapted from https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/email.ts#L84
async function sendVerificationRequest({
  url,
  provider,
  identifier,
}: SendVerificationRequestParams) {
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: "Sign in to USTimematch",
    text: renderEmailSignIn.text({ url }),
    html: renderEmailSignIn.html({ url }),
    sender: provider.from?.split(" ")[1]?.replace(/[<>]/g, ""),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length)
    throw new Error(`Email (${failed.join(", ")}) could not be sent`);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    maxAge: HALF_YEAR_IN_SECONDS,
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    // TODO: OAuth account's emailVerified column would be null by default,
    // an approach would be to fill the column based on profile.email_verified (provided by Google).
    async signIn({ user, email }) {
      // Guard email verification flow
      if (
        email?.verificationRequest &&
        user.email &&
        (await isRateLimited(user.email))
      )
        return false;

      return true;
    },
    async session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      server: env.EMAIL_SERVER,
      maxAge: ONE_DAY_IN_SECONDS,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      profile(profile) {
        // Only need email for now
        return {
          id: profile.sub,
          email: profile.email,
        };
      },
    }),
  ],
};

// Cloudflare Turnstile
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
const nextAuthApiHandler: NextApiHandler = async (req, res) => {
  const path = Array.isArray(req.query.nextauth)
    ? "/" + req.query.nextauth.join("/")
    : null;

  if (path === "/signin/email") {
    const formData = new FormData();
    formData.append("secret", env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
    formData.append("response", req.body["cf-turnstile-response"]);
    formData.append(
      "remoteip",
      req.headers["CF-Connecting-IP"]?.toString() || "",
    );

    const turnstileResult = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      },
    );
    const { success } = await turnstileResult.json();

    // Act as a next-auth EmailSignin error, if verification failed.
    // We must pass some url, otherwise next-auth would throws an error.
    // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/react/index.tsx#L265
    if (!success)
      return res.status(401).json({
        url: req.headers.origin + "/api/auth/error?error=EmailSignin",
      });
  }

  return NextAuth(req, res, authOptions);
};

export default nextAuthApiHandler;
