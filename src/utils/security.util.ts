import bcrypt from 'bcrypt';
import { saltRound } from './constants.util';

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => await bcrypt.compare(password, hashedPassword);

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, saltRound);
