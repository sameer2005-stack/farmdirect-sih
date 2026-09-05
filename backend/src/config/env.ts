import "dotenv/config";

const PORT = Number(process.env.PORT) || 5000;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export { PORT, JWT_SECRET };