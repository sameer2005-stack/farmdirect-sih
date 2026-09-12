import "dotenv/config";

const PORT = Number(process.env.PORT) || 5000;

const JWT_SECRET: string =
  process.env.JWT_SECRET ||
  (() => {
    throw new Error("JWT_SECRET is not defined");
  })();

const MANDISAARTHI_URL =
  process.env.MANDISAARTHI_URL || "http://127.0.0.1:8000";

export { PORT, JWT_SECRET, MANDISAARTHI_URL };
