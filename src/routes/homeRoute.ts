import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeHandler, apiInitialHandler } from "../handlers/initialHandlers";

export const homeRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler,
  },
  {
    method: "GET",
    path: "/api",
    handler: apiInitialHandler,
  },
];
