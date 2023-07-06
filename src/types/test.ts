import { UserCredentials } from "hapi";
import { AuthCredentials } from "@hapi/hapi";

export interface LogInResponsePayload {
  message: string;
  access_token: string;
}

export interface UserTestCredentials extends AuthCredentials<UserCredentials> {
  username: string;
  password: string;
  role?: string;
}

export interface UserBalanceResponsePayload {
  username: string;
  balance: number;
}
