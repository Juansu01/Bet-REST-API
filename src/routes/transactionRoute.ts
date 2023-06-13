import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Joi from "joi";

import {
  createNewTransaction,
  getAllTransactions,
  makeTransactionByUser,
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
      validate: {
        payload: Joi.object({
          category: Joi.string()
            .allow("withdraw", "deposit", "winning", "bet")
            .messages({
              "any.only":
                "Category can only be: withdraw, deposit, winning, bet",
            })
            .required(),
          amount: Joi.number().min(1).max(200).required(),
          user_id: Joi.number().min(1).required(),
          status: Joi.string(),
        }),
      },
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
    handler: makeTransactionByUser,
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          category: Joi.string()
            .allow("withdraw", "deposit", "winning", "bet")
            .messages({
              "any.only":
                "Category can only be: withdraw, deposit, winning, bet",
            })
            .required(),
          amount: Joi.number().min(1).max(200).required(),
          status: Joi.string(),
        }),
      },
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
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
        query: Joi.object({
          category: Joi.string()
            .allow("withdraw", "deposit", "winning", "bet")
            .messages({
              "any.only":
                "Category can only be: withdraw, deposit, winning, bet",
            })
            .optional(),
        }),
      },
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
