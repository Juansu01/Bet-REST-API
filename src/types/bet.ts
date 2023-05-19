import { Request } from "hapi";

import { BetStatus } from "../entities/Bet";

interface BetPayload {
  match_id: number;
  status: BetStatus;
  access_token: string;
}

export interface BetRequest extends Request {
  payload: BetPayload;
}
