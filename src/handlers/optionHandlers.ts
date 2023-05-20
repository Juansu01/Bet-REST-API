import { ResponseToolkit } from "hapi";
import Boom from "@hapi/boom";

import { Option } from "../entities/Option";
import { OptionRequest } from "../types/option";
import { Bet } from "../entities/Bet";

export const createNewOption = async (
  request: OptionRequest,
  h: ResponseToolkit
) => {
  const { number, name, odd, did_win, bet_id } = request.payload;
  const newOption = Option.create({ number, name, odd, did_win });
  const result = await Bet.find({
    relations: ["options"],
    where: { id: bet_id },
  });
  const betToAddOptionTo = result[0];

  if (betToAddOptionTo) {
    betToAddOptionTo.options.push(newOption);
    await betToAddOptionTo.save();
  }

  await newOption.save();

  return h.response(newOption).header("Content-Type", "application/json");
};

export const getAllOptions = async (
  request: OptionRequest,
  h: ResponseToolkit
) => {
  try {
    const options = await Option.createQueryBuilder("option")
      .leftJoinAndSelect("option.bets", "bet")
      .getMany();

    return h.response(options).header("Content-Type", "application/json");
  } catch (err) {
    throw Boom.badImplementation(err.message);
  }
};
