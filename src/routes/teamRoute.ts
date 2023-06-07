import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import { createNewTeam, getAllTeams } from "../handlers/teamHandlers";

export const teamRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/team",
    handler: createNewTeam,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/teams",
    handler: getAllTeams,
    options: {
      auth: "jwt",
    },
  },
];
