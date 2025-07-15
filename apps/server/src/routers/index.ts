import { publicProcedure, router } from "../lib/trpc";
import { bookRouter } from "./book";
import { lentRouter } from "./lent";
import { statisticsRouter } from "./statistics";
import { studentRouter } from "./student";
import { todoRouter } from "./todo";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  todo: todoRouter,
  student: studentRouter,
  book: bookRouter,
  lent: lentRouter,
  statistics: statisticsRouter,
});
export type AppRouter = typeof appRouter;
