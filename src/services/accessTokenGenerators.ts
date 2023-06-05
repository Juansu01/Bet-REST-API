import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import Jwt from "@hapi/jwt";

dotenv.config();

export const generateAccessToken = (userEmail: string) => {
  const secret: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  return jwt.sign({ userEmail }, secret, {
    expiresIn: "20m",
  });
};

export const hapiJWTGenerateToken = (userEmail: string, userRole: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  const token = Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      email: userEmail,
      role: userRole,
      sub: "user-session",
    },
    {
      key: secret,
      algorithm: "HS512",
    },
    {
      ttlSec: 1200, // 20 mins
    }
  );
  return token;
};
