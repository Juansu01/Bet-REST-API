import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import {
  createNewTransaction,
  getAllTransactions,
} from "../handlers/transactionHandlers";

export const transactionRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/transaction",
    handler: createNewTransaction,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/transactions",
    handler: getAllTransactions,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
];
