import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export default function generateToken(userId: string) {
  const token = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
}