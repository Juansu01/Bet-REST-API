import redisClient from "./redisClient";

const isTokenRevoked = async (token: string): Promise<boolean> => {
  const status = await redisClient.get(token);
  if (status && status === "revoked") return true;

  return false;
};

export default isTokenRevoked;
