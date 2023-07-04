import { ResponseToolkit } from "hapi";

import { EventRequest } from "../types/event";
import { Event } from "../entities/Event";
import myDataSource from "../services/dbConnection";
import Boom from "@hapi/boom";

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

export const getEventById = async (
  request: EventRequest,
  h: ResponseToolkit
) => {
  const eventId = request.params.id;
  const event = await myDataSource
    .getRepository(Event)
    .createQueryBuilder("event")
    .where({ id: parseInt(eventId) })
    .leftJoinAndSelect("event.matches", "match")
    .leftJoinAndSelect("match.bets", "bet")
    .leftJoinAndSelect("bet.options", "option")
    .getOne();

  if (event) return h.response(event);

  throw Boom.notFound("Event was not found.");
};

export const deleteEventById = async (
  request: EventRequest,
  h: ResponseToolkit
) => {
  const eventId = request.params.id;
  const event = await myDataSource
    .getRepository(Event)
    .createQueryBuilder("event")
    .withDeleted()
    .where({ id: parseInt(eventId) })
    .leftJoinAndSelect("event.matches", "match")
    .leftJoinAndSelect("match.bets", "bet")
    .leftJoinAndSelect("bet.options", "option")
    .addSelect("event.deleted_at")
    .getOne();

  if (event && event.deleted_at)
    throw Boom.notAcceptable("Event is already deleted.");

  if (event && !event.deleted_at) {
    await event.softRemove();
    return h.response("Event successfully deleted.");
  }

  throw Boom.notFound("Event wasn't found.");
};

export const getAllDeletedEvents = async (
  request: EventRequest,
  h: ResponseToolkit
) => {
  const allEvents = await myDataSource
    .getRepository(Event)
    .createQueryBuilder("event")
    .withDeleted()
    .leftJoinAndSelect("event.matches", "match")
    .leftJoinAndSelect("match.bets", "bet")
    .leftJoinAndSelect("bet.options", "option")
    .addSelect("event.deleted_at")
    .getMany();

  return h.response(allEvents);
};
