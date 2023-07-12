import Boom from "@hapi/boom";

import { TransactionCategory } from "../entities/Transaction";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";

export const makeTransaction = async (
  depositType: TransactionCategory,
  user: User,
  amount: number
): Promise<Transaction> => {
  if (
    depositType === TransactionCategory.DEPOSIT ||
    depositType === TransactionCategory.WINNING
  ) {
    user.balance = user.balance + amount;
    await user.save();
  }

  if (
    depositType === TransactionCategory.WITHDRAW ||
    depositType === TransactionCategory.BET
  ) {
    if (user.balance < amount)
      throw Boom.notAcceptable(`Cannot ${depositType}, balance is not enough.`);

    user.balance = user.balance - amount;
    await user.save();
  }
  const newTransaction = Transaction.create({
    category: depositType,
    status: "accepted",
    amount,
  });
  newTransaction.user = user;
  await newTransaction.save();
  return newTransaction;
};
