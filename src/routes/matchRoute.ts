import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import { createNewMatch, getAllMatches } from "../handlers/matchHandler";

export const matchRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/match",
    handler: createNewMatch,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/matches",
    handler: getAllMatches,
    options: {
      auth: "jwt",
    },
  },
];
