import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { TransactionRequest } from "../types/transaction";
import { Transaction, TransactionCategory } from "../entities/Transaction";
import { User } from "../entities/User";
import { makeTransaction } from "../services/transactionService";
import { UserCredentials } from "../types/authentication";

export const createNewTransaction = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const { user_id, category, status, amount } = request.payload;
  const user = await User.findOneBy({ id: user_id });

  if (!user) throw Boom.notFound("User not found, won't add new transaction.");

  if (!Object.values(TransactionCategory).includes(category))
    throw Boom.notAcceptable(
      "Category must be of these categories: deposit, withdraw, winning, bet"
    );

  const result: string | Transaction = await makeTransaction(
    category,
    user,
    amount
  );

  if (result instanceof Transaction) {
    return h.response(result);
  }

  throw Boom.badRequest(result);
};

export const getAllTransactions = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const allTransactions = await Transaction.find({
    relations: {
      user: true,
    },
  });

  return h.response(allTransactions);
};

export const makeTransactionByUser = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const userCredentials = request.auth.credentials as UserCredentials;
  const { amount, category } = request.payload;
  const user = await User.findOne({ where: { email: userCredentials.email } });

  if (!user) throw Boom.notFound("User was not found.");

  if (!Object.values(TransactionCategory).includes(category))
    throw Boom.notAcceptable(
      "Category must be of these categories: deposit, withdraw, winning, bet"
    );

  const result: string | Transaction = await makeTransaction(
    category,
    user,
    amount
  );

  if (result instanceof Transaction) {
    return h.response(result);
  }

  throw Boom.badRequest(result);
};

export const getUserBalance = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const userCredentials = request.auth.credentials as UserCredentials;
  const user = await User.findOne({ where: { email: userCredentials.email } });

  return h.response({ username: user?.username, balance: user?.balance });
};

export const getUserBalanceById = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const user = await User.findOne({ where: { id: parseInt(id) } });

  if (!user) throw Boom.notFound("User was not found.");

  return h.response({ username: user?.username, balance: user?.balance });
};

export const getUserTransactions = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const category = request.query.category as TransactionCategory;
  const userCredentials = request.auth.credentials as UserCredentials;
  let transactions;
  const user = await User.findOne({ where: { email: userCredentials.email } });

  if (!user) throw Boom.notFound("User was not found.");

  transactions = await Transaction.find({ where: { user_id: user.id } });

  if (category) {
    if (!Object.values(TransactionCategory).includes(category))
      throw Boom.notAcceptable(
        "Category must be of these categories: deposit, withdraw, winning, bet"
      );

    transactions = await Transaction.find({
      where: { category: category, user_id: user!.id },
    });
  }

  return h.response(transactions);
};

export const getUserTransactionsById = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  const category = request.query.category as TransactionCategory;
  const { id } = request.params;
  let transactions;
  const user = await User.findOne({ where: { id: parseInt(id) } });

  if (!user) throw Boom.notFound("User does not exist.");

  if (category) {
    if (!Object.values(TransactionCategory).includes(category))
      throw Boom.notAcceptable(
        "Category must be of these categories: deposit, withdraw, winning, bet"
      );
    transactions = await Transaction.find({
      where: { category: category, user_id: user.id },
    });
  } else {
    transactions = await Transaction.find({ where: { user_id: user.id } });
  }

  return h.response(transactions);
};
