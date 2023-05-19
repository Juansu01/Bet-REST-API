import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (userEmail: string) => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  return jwt.sign({ userEmail }, secret, {
    expiresIn: "20m",
  });
};
