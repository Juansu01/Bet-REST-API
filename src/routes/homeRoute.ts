import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { homeHandler } from "../handlers/initialHandlers";

export const homeRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler,
    options: {
      auth: "jwt",
      plugins: {
        "hapi-rate-limitor": {
          userAttribute: "email",
          max: 5, // a maximum of 5 requests
          duration: 60 * 1000, // per minute
          enabled: true,
        },
      },
    },
  },
];
