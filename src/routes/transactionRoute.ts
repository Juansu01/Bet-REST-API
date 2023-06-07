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
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/transactions",
    handler: getAllTransactions,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
  {
    method: "POST",
    path: "/api/transaction-by-user",
    handler: depositIntoAccount,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/user/balance",
    handler: getUserBalance,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/my-transactions",
    handler: getUserTransactions,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}/transactions",
    handler: getUserTransactionsById,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}/balance",
    handler: getUserBalanceById,
    options: {
      auth: "jwt",
      pre: [{ method: checkAdminPermissions, assign: "checkAdminPermissions" }],
    },
  },
];
