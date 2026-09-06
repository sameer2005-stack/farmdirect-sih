import bcrypt from "bcrypt";

export default async function comparePassword(
  password: string,
  hashedPassword: string
) {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
}