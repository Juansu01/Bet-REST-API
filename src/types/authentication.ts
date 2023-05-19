import { Request } from "hapi";

interface AuthenticationPayload {
  email: string;
  password: string;
  access_token: string;
}

interface RegistrationPayload {
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  username: string;
  address: string;
  gender: string;
  birth_date: string;
  country_id: number;
  city: string;
  category: string;
  document_id: string;
}

export interface RegisterRequest extends Request {
  payload: RegistrationPayload;
}

export interface AuthenticationRequest extends Request {
  payload: AuthenticationPayload;
}
