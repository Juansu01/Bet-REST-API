import { Request } from "hapi";

interface TeamPayload {
  match_id: number;
  name: string;
}

export interface TeamRequest extends Request {
  payload: TeamPayload;
}
