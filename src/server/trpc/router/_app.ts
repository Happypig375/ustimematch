import { router } from "../trpc";
import { authRouter } from "./auth";
import { icalRouter } from "./ical";
import { persistRouter } from "./persist";
import { shareRouter } from "./share";

export const appRouter = router({
  auth: authRouter,
  ical: icalRouter,
  share: shareRouter,
  persist: persistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
