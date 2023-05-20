import { Request } from "hapi";

import { TransactionCategory } from "../entities/Transaction";

interface TransactionPayload {
  user_id: number;
  category: TransactionCategory;
  status: string;
}

export interface TransactionRequest extends Request {
  payload: TransactionPayload;
}
