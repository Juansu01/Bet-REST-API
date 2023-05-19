import { Request } from "hapi";

interface MatchPayload {
  date: Date;
  event_id: number;
  winner: string;
  access_token: string;
}

export interface MatchRequest extends Request {
  payload: MatchPayload;
}
