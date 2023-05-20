import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { TransactionRequest } from "../types/transaction";
import { Transaction } from "../entities/Transaction";
import myDataSource from "../services/dbConnection";

export const createNewTransaction = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  try {
    const { user_id, category, status, amount } = request.payload;
    const newTransaction = Transaction.create({
      user_id,
      category,
      status,
      amount,
    });

    await newTransaction.save();
    return h
      .response(newTransaction)
      .header("Content-Type", "application/json");
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation(err.message);
  }
};

export const getAllTransactions = async (
  request: TransactionRequest,
  h: ResponseToolkit
) => {
  try {
    const transactions = await myDataSource.getRepository(Transaction).find({
      relations: {
        user: true,
      },
    });

    return h.response(transactions).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};
