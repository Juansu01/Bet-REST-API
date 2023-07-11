import { ResponseToolkit, Request } from "hapi";
import Boom from "@hapi/boom";
import Jwt, { HapiJwt } from "@hapi/jwt";
import dotenv from "dotenv";

import { User } from "../entities/User";
import {
  RegisterRequest,
  AuthenticationRequest,
  UserCredentials,
  MyArtifacts,
} from "../types/authentication";
import { hapiJWTGenerateToken } from "../services/accessTokenGenerators";
import redisClient from "../cache/redisClient";

dotenv.config();
export const registerHandler = async (
  request: RegisterRequest,
  h: ResponseToolkit
) => {
  const {
    role,
    first_name,
    last_name,
    phone,
    email,
    password,
    username,
    address,
    gender,
    birth_date,
    country_id,
    city,
    category,
    document_id,
  } = request.payload;

  const user = await User.findOneBy({ email: email });
  if (user) throw Boom.notAcceptable("Email is already taken.");
  const newUser = User.create({
    role,
    first_name,
    last_name,
    phone,
    email,
    password,
    username,
    address,
    gender,
    birth_date,
    country_id,
    city,
    category,
    document_id,
  });

  await newUser.save();

  return h.response(newUser).header("Content-Type", "application/json");
};

export const loginHandler = async (
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const userCredentials = request.auth.credentials as UserCredentials;
  const accessToken: string = hapiJWTGenerateToken(
    userCredentials.email,
    userCredentials.role
  );
  const redisExpiration = 1200; // 20 mins

  await redisClient.setEx(accessToken, redisExpiration, "active");
  return h.response({
    message: "Logged in successfully!",
    access_token: accessToken,
  });
};

export const blockUser = async (
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const userToBlock = await User.findOneBy({ id: parseInt(id) });

  if (!userToBlock) throw Boom.notFound("User was not found.");

  if (userToBlock.role === "admin")
    throw Boom.forbidden("Cannot block other admins.");

  if (userToBlock.state === "blocked")
    throw Boom.badRequest("User is already blocked.");

  userToBlock.state = "blocked";
  await userToBlock.save();
  return h.response(
    `User identified by email: ${userToBlock.email} has been blocked.`
  );
};

export const logoutHandler = async (request: Request, h: ResponseToolkit) => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  const artifactsAsMine = request.auth.artifacts as MyArtifacts;
  const artifactsAsJWT = request.auth
    .artifacts as HapiJwt.Artifacts<HapiJwt.JwtRefs>;

  try {
    Jwt.token.verify(artifactsAsJWT, secret);
    const result = await redisClient.get(artifactsAsMine.token);
    if (result) redisClient.set(artifactsAsMine.token, "revoked");
  } catch (err) {
    console.error(err);
    return h.response({ message: "Successfully logged out." });
  }

  return h.response({ message: "Successfully logged out." });
};
