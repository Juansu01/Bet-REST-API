import { Request } from "hapi";

interface EventPayload {
  sport: string;
  access_token: string;
}

export interface EventRequest extends Request {
  payload: EventPayload;
}
