import Boom from "@hapi/boom";

import { Bet } from "../entities/Bet";
import { BetStatus } from "../entities/Bet";
import { PlacedBet } from "../entities/PlacedBet";
import { User } from "../entities/User";
import { Match } from "../entities/Match";
import { RewardedUser } from "../types/placedBet";
import { makeTransaction } from "./transactionService";
import { TransactionCategory } from "../entities/Transaction";

export const canSettleBet = async (
  bet: Bet,
  winningOption: string
): Promise<number> => {
  for (const option of bet.options) {
    if (option.name === winningOption) {
      option.did_win = true;
      await option.save();
      return option.odd;
    }
  }

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

export const settleBet = async (
  betToSettle: Bet,
  winningOption: string
): Promise<void> => {
  const matchFromBet = await Match.findOneBy({ id: betToSettle.match_id });

  if (matchFromBet) matchFromBet.winner = winningOption;

  betToSettle.result = winningOption;
  betToSettle.status = BetStatus.SETTLED;
  await betToSettle.save();
};
