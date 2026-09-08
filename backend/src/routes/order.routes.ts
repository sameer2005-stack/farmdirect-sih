import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getFarmerOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/farmer", authMiddleware, getFarmerOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/status", authMiddleware, updateOrderStatus);

export default router;
