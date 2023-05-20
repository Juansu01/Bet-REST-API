import { ResponseToolkit } from "hapi";

import { User } from "../entities/User";
import {
  RegisterRequest,
  AuthenticationRequest,
} from "src/types/authentication";
import myDataSource from "../services/dbConnection";
import { generateAccessToken } from "../services/accessTokenGenerators";

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
    select: { password: true },
  });
  const user = results[0];

  if (user) {
    if (password === user.password) {
      const accessToken: string = generateAccessToken(email);
      return h.response({
        message: "Logged in successfully!",
        access_token: accessToken,
      });
    }
    return h.response("Wrong password.").code(401);
  }

  return h.response("User not found.").code(404);
};
