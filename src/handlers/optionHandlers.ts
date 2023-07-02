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

export const getOptionById = async (
  request: OptionRequest,
  h: ResponseToolkit
) => {
  const id = request.params.id;
  const option = await Option.findOne({
    where: {
      id: parseInt(id),
    },
    relations: {
      bets: true,
    },
  });
  if (option) return h.response(option);

  throw Boom.notFound("Option was not found.");
};

export const getOptionsFromBet = async (
  request: OptionRequest,
  h: ResponseToolkit
) => {
  const betId = request.params.id;
  const optionsFromBet = await Option.find({
    where: { bets: { id: parseInt(betId) } },
    relations: { bets: true },
  });

  if (optionsFromBet.length > 0) {
    return h.response(optionsFromBet);
  }

  throw Boom.notFound("Couldn't find options from bet.");
};
