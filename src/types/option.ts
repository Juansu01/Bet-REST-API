import { Request } from "hapi";

interface OptionPayload {
  number: number;
  access_token: string;
  name: string;
  odd: number;
  did_win: boolean;
  bet_id: number;
}

export interface OptionRequest extends Request {
  payload: OptionPayload;
}
