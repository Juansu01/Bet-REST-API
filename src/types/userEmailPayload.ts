import { JwtPayload } from "jsonwebtoken";

export interface MyPayload extends JwtPayload {
  userEmail: string;
}
