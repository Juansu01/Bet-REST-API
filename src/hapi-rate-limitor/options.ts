import { Options } from "hapi-rate-limitor";

export const options: Options = {
  enabled: true,
  userAttribute: "email",
  namespace: "hapi-rate-limitor",
  max: 1000,
  duration: 60 * 1000, // per minute (the value is in milliseconds)
  userLimitAttribute: "email",
  skip: async (request) => {
    const unlimitedRoutes = ["/login", "/logout"];
    const willSkip = unlimitedRoutes.some((unlimitedRoute) => {
      request.path.includes(unlimitedRoute);
    });
    return willSkip;
  },
};
