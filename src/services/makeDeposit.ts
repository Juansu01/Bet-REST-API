import { TransactionCategory } from "../entities/Transaction";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import Boom from "@hapi/boom";

export const makeTransaction = async (
  depositType: TransactionCategory,
  user: User,
  amount: number
): Promise<string | Transaction> => {
  try {
    if (depositType === "deposit" || depositType === "winning") {
      user.balance = +user.balance + amount;
      await user.save();
      const newTransaction = Transaction.create({
        category: depositType,
        status: "accepted",
        amount,
      });
      newTransaction.user = user;
      await newTransaction.save();
      return newTransaction;
    }

    if (depositType === "withdraw" || depositType === "bet") {
      if (+user.balance === amount || +user.balance > amount) {
        user.balance = +user.balance - amount;
        await user.save();
        const newTransaction = Transaction.create({
          category: depositType,
          status: "accepted",
          amount,
        });
        newTransaction.user = user;
        await newTransaction.save();
        return newTransaction;
      }
      return `Cannot ${depositType}, balance is not enough.`;
    }
    return `${depositType} is not a supported deposit type.`;
  } catch (err) {
    console.error(err);
    throw Boom.badImplementation(err);
  }
};
