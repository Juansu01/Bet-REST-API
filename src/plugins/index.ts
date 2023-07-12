import Jwt from "@hapi/jwt";
import HapiRateLimitorPluginObject from "./hapiRateLimitor";

const pluginList = [HapiRateLimitorPluginObject, Jwt];

export default pluginList;
