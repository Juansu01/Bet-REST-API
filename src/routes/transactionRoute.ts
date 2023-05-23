import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";

import { checkAccessToken } from "../middlewares/checkAccessToken";
import {
  createNewTransaction,
  getAllTransactions,
  depositIntoAccount,
  getUserBalance,
  getUserTransactions,
  getUserTransactionsById,
  getUserBalanceById,
} from "../handlers/transactionHandlers";
import { checkAdminPermissions } from "../middlewares/checkAdminPermission";

export const transactionRoutes: ServerRoute<ReqRefDefaults>[] = [
  {
    method: "POST",
    path: "/api/transaction",
    handler: createNewTransaction,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "checkAdminPermissions" },
      ],
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
  {
    method: "POST",
    path: "/api/transaction-by-user",
    handler: depositIntoAccount,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/user/balance",
    handler: getUserBalance,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/my-transactions",
    handler: getUserTransactions,
    options: {
      pre: [{ method: checkAccessToken, assign: "checkAccessToken" }],
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}/transactions",
    handler: getUserTransactionsById,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "checkAdminPermissions" },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}/balance",
    handler: getUserBalanceById,
    options: {
      pre: [
        { method: checkAccessToken, assign: "checkAccessToken" },
        { method: checkAdminPermissions, assign: "checkAdminPermissions" },
      ],
    },
  },
];
