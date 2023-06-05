import { ResponseToolkit } from "hapi";

import { User } from "../entities/User";
import {
  RegisterRequest,
  AuthenticationRequest,
} from "src/types/authentication";
import myDataSource from "../services/dbConnection";
import {
  generateAccessToken,
  hapiJWTGenerateToken,
} from "../services/accessTokenGenerators";
import Boom from "@hapi/boom";

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

  try {
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
  } catch (err) {
    console.error(err);
    return h
      .response({ message: "Internal server error.", error: err.message })
      .code(500)
      .header("Content-Type", "application/json");
  }
};

export const loginHandler = async (
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const { email, password } = request.payload;

  const results = await myDataSource.getRepository(User).find({
    where: {
      email: email,
    },
    select: { password: true, state: true, email: true, role: true },
  });
  const user = results[0];

  if (user) {
    if (user.state === "blocked")
      throw Boom.forbidden("Your account was blocked.");
    if (password === user.password) {
      const accessToken: string = hapiJWTGenerateToken(user.email, user.role);
      return h.response({
        message: "Logged in successfully!",
        access_token: accessToken,
      });
    }
    return h.response("Wrong password.").code(401);
  }

  return h.response("User not found.").code(404);
};

export const blockUser = async (
  request: AuthenticationRequest,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const userToBlock = await User.findOneBy({ id: parseInt(id) });

  if (userToBlock) {
    if (userToBlock.role === "admin")
      throw Boom.forbidden("Cannot block other admins.");

    if (userToBlock.state === "blocked")
      throw Boom.badRequest("User is already blocked.");

    userToBlock.state = "blocked";
    await userToBlock.save();

    return h.response(
      `User identified by email: ${userToBlock.email} has been blocked.`
    );
  }

  throw Boom.notFound("User was not found.");
};
