import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";
import { prisma } from "../../server/db/client";

type ResponseData = {
  data?: {
    sharedTimetablesCount: number;
    verificationTokenCount: number;
  };
  error?: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log(req.headers.authorization);
  const { ACTION_KEY: LOCAL_ACTION_KEY } = env;
  const ACTION_KEY = req.headers.authorization?.split(" ")[1];

  if (ACTION_KEY !== LOCAL_ACTION_KEY)
    return res.status(401).json({ error: { message: "Unauthorized" } });

  try {
    const { count: sharedTimetablesCount } =
      await prisma.sharedTimetables.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    const { count: verificationTokenCount } =
      await prisma.verificationToken.deleteMany({
        where: {
          expires: {
            lt: new Date(),
          },
        },
      });
    res
      .status(200)
      .json({ data: { sharedTimetablesCount, verificationTokenCount } });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ error: { message: cause.message } });
      return;
    }
    res.status(500).json({
      error: { message: "Error while purging expired records" },
    });
  }
}
