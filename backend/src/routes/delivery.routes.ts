import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  assignDeliveryPartner,
  createDelivery,
  updateDeliveryStatus,
} from "../controllers/delivery.controller";

const router = Router();
router.post("/", authMiddleware, createDelivery);

router.patch("/:id/assign", authMiddleware, assignDeliveryPartner);

router.patch("/:id/status", authMiddleware, updateDeliveryStatus);

export default router;
