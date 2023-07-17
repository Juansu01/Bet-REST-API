import { Request } from "hapi";

export interface PlacedBetPayload {
  user_id?: number;
  bet_id: number;
  bet_option: string;
  amount: number;
}

export interface PlacedBetRequest extends Request {
  payload: PlacedBetPayload;
}

export interface RewardedUser {
  email: string;
  amount: number;
}
