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
  const betToAddOptionTo = await Bet.findOne({
    relations: ["options"],
    where: { id: bet_id },
  });

  if (!betToAddOptionTo)
    throw Boom.notFound("Couldn't find bet, won't create option.");

  betToAddOptionTo.options.push(newOption);
  await betToAddOptionTo.save();
  await newOption.save();

  return h.response(newOption).header("Content-Type", "application/json");
};

export const getAllOptions = async (
  request: OptionRequest,
  h: ResponseToolkit
) => {
  const allOptions = await Option.find({ relations: { bets: true } });

  return h.response(allOptions).header("Content-Type", "application/json");
};
