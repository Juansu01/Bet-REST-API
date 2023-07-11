import HapiRateLimitor from "hapi-rate-limitor";
import { Options } from "hapi-rate-limitor";
import { UserCredentials } from "../types/authentication";

export const options: Options = {
  enabled: true,
  userAttribute: "email",
  namespace: "hapi-rate-limitor",
  max: 1000,
  duration: 60 * 1000, // per minute (the value is in milliseconds)
  userLimitAttribute: "email",
  skip: async (request) => {
    const unlimitedRoutes = [
      "/login",
      "/logout",
      "team",
      "event",
      "option",
      "transaction",
      "match",
      "placed",
      "user",
    ];
    const willSkip = unlimitedRoutes.some((unlimitedRoute) => {
      return request.path.includes(unlimitedRoute);
    });
    const credentials = request.auth.credentials as unknown as UserCredentials;

    return credentials.role === "admin" || willSkip;
  },
};

export const HapiRateLimitorPluginObject = {
  plugin: HapiRateLimitor,
  options: options,
};
