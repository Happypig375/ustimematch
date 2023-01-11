import { nanoid } from "nanoid";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { ZTimetable } from "./../../../types/timetable.d";

export const shareRouter = router({
  getTimetables: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const timetables = await ctx.prisma.sharedTimetables.findUniqueOrThrow({
        where: { slug: input.slug },
      });

      return timetables;
    }),
  guestShare: publicProcedure
    .input(z.object({ timetables: ZTimetable.array().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Excludes clien-side only id and visible, only includes color when sharing
      const mappedTimetables = input.timetables.map((timetable) => ({
        ...timetable,
        config: { color: timetable.config.color },
      }));

      // Prevent sharing the same set of timetables
      const existing = await ctx.prisma.sharedTimetables.findFirst({
        where: {
          timetables: {
            equals: mappedTimetables,
          },
        },
      });

      if (existing)
        return {
          slug: existing.slug,
          expiresAt: existing.expiresAt,
        };

      // Create shared timetables
      const { slug, expiresAt } = await ctx.prisma.sharedTimetables.create({
        data: {
          // URL-friendly querying key
          slug: nanoid(),
          timetables: mappedTimetables,
        },
      });

      return { slug, expiresAt };
    }),
});
