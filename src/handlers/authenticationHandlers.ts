import { ResponseToolkit } from "hapi";

import { User } from "../entities/User";
import {
  RegisterRequest,
  AuthenticationRequest,
} from "src/types/authentication";
import myDataSource from "../services/dbConnection";

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

  const user = await myDataSource.getRepository(User).findOneBy({
    email: email,
  });

  if (user) {
    return h.response(user);
  }

  return h.response("That is not a user :c");
};
