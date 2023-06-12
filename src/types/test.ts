import { UserCredentials } from "hapi";
import { AuthCredentials } from "@hapi/hapi";

export interface LogInResponsePayload {
  message: string;
  access_token: string;
}

export interface TestCredentials extends AuthCredentials<UserCredentials> {
  username: string;
  password: string;
}