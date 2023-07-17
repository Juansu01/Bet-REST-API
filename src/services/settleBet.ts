import { Bet } from "../entities/Bet";

export const canSettleBet = async (
  bet: Bet,
  winningOption: string
): Promise<[boolean, number]> => {
  bet.options.forEach(async (option) => {
    if (option.name === winningOption) {
      option.did_win = true;
      await option.save();
      return [true, option.odd];
    }
  });

  return [false, 0];
};
