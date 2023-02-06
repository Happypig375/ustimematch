import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import type { Timetable } from "../../../types/timetable";
import { ZTimetable } from "../../../types/timetable";
import { router, publicProcedure } from "../trpc";

export const shareRouter = router({
  getTimetables: publicProcedure
    .input(z.object({ slug: z.string() }))
    .output(z.object({ timetables: ZTimetable.array().min(1) }))
    .query(async ({ ctx, input }) => {
      const { expiresAt, timetables } =
        await ctx.prisma.sharedTimetables.findUniqueOrThrow({
          where: { slug: input.slug },
        });

      if (new Date() > expiresAt)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The requested timetables have expired.",
        });

      const mappedTimetables = (timetables as Timetable[]).map((timetable) => ({
        ...timetable,
        // Add back client-side only id and visible
        config: { ...timetable.config, id: nanoid(), visible: true },
      }));

      const result = ZTimetable.array().safeParse(mappedTimetables);
      if (!result.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The requested timetables do not match schema.",
        });

      return {
        timetables: result.data,
      };
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

      if (existing && new Date() < existing.expiresAt)
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
