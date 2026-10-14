import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const EXPIRES_IN = '7d';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  const payload = jwt.verify(token, env.jwtSecret);
  return payload.sub;
}
