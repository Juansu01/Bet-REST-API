import redisClient from "./redisClient";

const checkTokenStatus = async (token: string): Promise<boolean> => {
  const status = await redisClient.get(token);
  if (status && status === "revoked") return true;

  return false;
};

export default checkTokenStatus;
