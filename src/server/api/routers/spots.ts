import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.spot.findMany();
  }),
});
