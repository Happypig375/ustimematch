import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { SendVerificationRequestParams } from "next-auth/providers/email";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

// TODO: find a better solution for rate limiting
// Since there's no way to pass around states,
// we need to call this function 2 times to prevent sending email and creating database record.
// https://github.com/nextauthjs/next-auth/blob/6132c3fa751b647dd8261ac9b30e24fb140a2f1a/packages/next-auth/src/core/lib/email/signin.ts
async function rateLimited(identifier: string, expires: Date) {
  const count = await prisma.verificationToken.count({
    where: {
      identifier: { equals: identifier },
      AND: [
        { expires: { gt: new Date(expires.getTime() - 60 * 1000) } },
        { expires: { lt: expires } },
      ],
    },
  });
  console.log("request within last minute: ", identifier, count);

  return count > 1;
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: {
    ...PrismaAdapter(prisma),
    // https://github.com/nextauthjs/next-auth/blob/6132c3fa751b647dd8261ac9b30e24fb140a2f1a/packages/adapter-prisma/src/index.ts
    async createVerificationToken(data) {
      if (await rateLimited(data.identifier, data.expires)) return;

      const verificationToken = await prisma.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },
  },
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
  expires,
}: SendVerificationRequestParams) {
  if (await rateLimited(identifier, expires))
    throw new Error(`Rate limit exceeded for ${identifier}`);

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
