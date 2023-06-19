import { TestServer } from "../../src/types/server";
import { LogInResponsePayload, TestCredentials } from "../../src/types/test";
import generateBasicAuthHeader from "./generateAuthHeader";

const logUserIn = async (
  userCredentials: TestCredentials,
  server: TestServer
): Promise<string | null> => {
  const userAuthToken = generateBasicAuthHeader(
    userCredentials.username,
    userCredentials.password
  );
  const userLogInRes = await server.inject({
    method: "post",
    url: "/api/login",
    headers: {
      authorization: userAuthToken,
    },
  });

  if (userLogInRes.statusCode === 200) {
    const userLogInPayload: LogInResponsePayload = JSON.parse(
      userLogInRes.payload
    );
    return userLogInPayload.access_token;
  }

  return null;
};

export default logUserIn;
