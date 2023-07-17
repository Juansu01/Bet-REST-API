import Boom from "@hapi/boom";

import { Bet } from "../entities/Bet";
import { PlacedBet } from "../entities/PlacedBet";
import { User } from "../entities/User";
import { RewardedUser } from "../types/placedBet";
import { makeTransaction } from "./transactionService";
import { TransactionCategory } from "../entities/Transaction";

export const canSettleBet = async (
  bet: Bet,
  winningOption: string
): Promise<number> => {
  bet.options.forEach(async (option) => {
    if (option.name === winningOption) {
      option.did_win = true;
      await option.save();
      return option.odd;
    }
  });

  throw Boom.notFound("Winning option is not inside Bet.");
};

export const rewardUsers = async (
  placedBets: PlacedBet[],
  odd: number
): Promise<RewardedUser[]> => {
  const rewardedUsers: RewardedUser[] = [];

  placedBets.forEach(async (placedBet) => {
    const userToReward = await User.findOne({
      where: { id: placedBet.user_id },
    });

    if (!userToReward) return;

    const amountToAdd = placedBet.amount * odd;
    console.log(`${userToReward.email} will be rewarded for ${amountToAdd}!`);

    await makeTransaction(
      TransactionCategory.WINNING,
      userToReward!,
      amountToAdd
    );
    rewardedUsers.push({
      email: userToReward.email,
      amount: amountToAdd,
    });
  });

  return rewardedUsers;
};
