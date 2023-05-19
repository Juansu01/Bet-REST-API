import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import { createNewBet, getAllBets } from "../handlers/betHandlers";

export const betRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/bet",
    handler: createNewBet,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/bets",
    handler: getAllBets,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
];
