import base64 from "base-64";

const generateBasicAuthHeader = (
  username: string,
  password: string
): string => {
  const encodedCredentials = base64.encode(`${username}:${password}`);
  return "Basic " + encodedCredentials;
};

export default generateBasicAuthHeader;
