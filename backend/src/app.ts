import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("FarmDirect backend is running!");
});

app.use(errorMiddleware);
export default app;
