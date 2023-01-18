import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

type ResponseData = {
  data?: {
    count: number;
  };
  error?: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { APP_KEY } = process.env;
  const ACTION_KEY = req.headers.authorization?.split(" ")[1];

  if (!APP_KEY || !ACTION_KEY || APP_KEY !== ACTION_KEY)
    return res.status(401).json({ error: { message: "Unauthorized" } });

  try {
    const { count } = await prisma.sharedTimetables.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    res.status(200).json({ data: { count } });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ error: { message: cause.message } });
      return;
    }
    res.status(500).json({
      error: { message: "Error while deleteing expired shared timetables" },
    });
  }
}
