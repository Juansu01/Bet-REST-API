import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import {
  createNewBet,
  getAllBets,
  changeBetStatus,
  settleBet,
} from "../handlers/betHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const betRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/bet",
    handler: createNewBet,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/bets",
    handler: getAllBets,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PATCH",
    path: "/api/bets/{id}",
    handler: changeBetStatus,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
  {
    method: "PATCH",
    path: "/api/settle-bet/{id}",
    handler: settleBet,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "AdminPermissions" }],
    },
  },
];
