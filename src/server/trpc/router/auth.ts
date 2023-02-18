import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { protectedProcedure } from "./../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  unlinkAccount: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.account.delete({
        where: { id },
      });
    }),
});
