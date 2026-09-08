import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createOrder, getMyOrders } from "../controllers/order.controller.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);

export default router;
