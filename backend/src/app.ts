import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("FarmDirect backend is running!");
});

app.use(errorMiddleware);
export default app;