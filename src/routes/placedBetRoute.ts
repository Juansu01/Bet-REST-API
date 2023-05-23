import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import {
  createNewPlacedBet,
  getAllPlacedBets,
} from "../handlers/placedBetHandlers";

export const placedBetRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/placed-bet",
    handler: createNewPlacedBet,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/placed-bets",
    handler: getAllPlacedBets,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
];
