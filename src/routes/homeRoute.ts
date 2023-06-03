import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeHandler } from "../handlers/initialHandlers";

export const homeRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler,
    options: {
      auth: "simple",
    },
  },
];
