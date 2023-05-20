import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
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
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "AdminPermissions" },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/bets",
    handler: getAllBets,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "AdminPermissions" },
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/bets/{id}",
    handler: changeBetStatus,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "AdminPermissions" },
      ],
    },
  },
  {
    method: "PATCH",
    path: "/api/settle-bet/{id}",
    handler: settleBet,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "AdminPermissions" },
      ],
    },
  },
];
