import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { defaultTimetableStore, ZTimetableStore } from "@store/timetable";
import { jsonSchema } from "../../../types/json";
import { router } from "../trpc";
import { protectedProcedure } from "./../trpc";

export const persistRouter = router({
  setPersist: protectedProcedure
    .input(z.object({ timetableStore: ZTimetableStore }))
    .mutation(async ({ ctx, input: { timetableStore } }) => {
      // Prase as JSON otherwise prisma will throw type error.
      const result = jsonSchema.safeParse(timetableStore);
      if (!result.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Data does not match JSON schema.",
        });

      // Update will throw if record does not exist
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          // JSON field cannot be null, otherwise will conflict with database.
          // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#using-null-values
          timetableStore: result.data === null ? Prisma.JsonNull : result.data,
        },
      });
    }),
  getPersist: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });

    // Initial query will be null
    if (!user.timetableStore) return defaultTimetableStore;

    const result = ZTimetableStore.safeParse(user.timetableStore);
    if (!result.success)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Data does not match schema.",
      });

    return result.data;
  }),
});
