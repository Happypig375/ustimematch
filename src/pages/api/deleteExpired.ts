import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { appRouter } from "../../server/trpc/router/_app";

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

  const caller = appRouter.createCaller({ session: null, prisma });

  try {
    const { count } = await caller.share.deleteExpiredTimetables();
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
