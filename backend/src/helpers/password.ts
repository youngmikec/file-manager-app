import bcrypt from "bcrypt";
import app from '../server.js';
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}

export const generateAccessToken = (data: any): { accessToken: string} => {
  const payload = { user: data, type: 'access'};
  const accessToken = app.jwt.sign(payload, { expiresIn: '1h' });
  return { accessToken };
}  

export const verifyAccessToken = (token: string): string => {
  return app.jwt.verify(token, { key: env.JWT_SECRET });
};