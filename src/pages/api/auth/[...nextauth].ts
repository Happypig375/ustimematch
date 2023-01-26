// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { SendVerificationRequestParams } from "next-auth/providers/email";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  session: {
    maxAge: 6 * 30 * 24 * 60 * 60, // 6 months
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
};

export default NextAuth(authOptions);

async function sendVerificationRequest({
  provider,
  identifier,
  url,
}: SendVerificationRequestParams) {
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: "Sign in to USTimematch",
    text: text({ url }),
    html: html({ url }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

function html({ url }: { url: string }) {
  return `
    Thanks for using USTimematch!<br/><br/>
    Please click the below link to sign in to your account:<br/><br/>
    <a style="word-break: break-all" href="${url}">${url}</a><br/><br/>
    <span style="color: #ef4444">*</span> The link will expire in 24 hours.<br/>
    <span style="color: #ef4444">*</span> If you didn't request for this email, please ignore it.
  `;
}

function text({ url }: { url: string }) {
  return `
    Thanks for using USTimematch!\n
    Please click the below link to sign in to your account:\n
    ${url}\n
    * The link will expire in 24 hours.\n
    * If you didn't request for this email, please ignore it.
  `;
}
