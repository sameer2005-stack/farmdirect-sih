import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.post("/", authMiddleware, createOrder);

export default router;