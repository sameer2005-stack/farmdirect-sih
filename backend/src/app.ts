import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("FarmDirect backend is running!");
});

app.use(errorMiddleware);
export default app;
