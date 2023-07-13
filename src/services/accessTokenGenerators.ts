import dotenv from "dotenv";
import Jwt from "@hapi/jwt";

dotenv.config();
export const hapiJWTGenerateToken = (
  userEmail: string,
  userRole: string
): string => {
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
