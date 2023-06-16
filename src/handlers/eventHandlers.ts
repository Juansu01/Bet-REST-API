import { ResponseToolkit } from "hapi";

import { EventRequest } from "../types/event";
import { Event } from "../entities/Event";
import myDataSource from "../services/dbConnection";

export const createNewEvent = async (
  request: EventRequest,
  h: ResponseToolkit
) => {
  const { sport } = request.payload;
  const newEvent = Event.create({ sport });

  await newEvent.save();
  return h.response(newEvent).header("Content-Type", "application/json");
};

export const getAllEvents = async (
  request: EventRequest,
  h: ResponseToolkit
) => {
  const allEvents = await myDataSource
    .getRepository(Event)
    .createQueryBuilder("event")
    .leftJoinAndSelect("event.matches", "match")
    .leftJoinAndSelect("match.bets", "bet")
    .leftJoinAndSelect("bet.options", "option")
    .getMany();

  return h.response(allEvents);
};
