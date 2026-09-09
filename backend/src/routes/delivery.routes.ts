import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { createDelivery } from "../controllers/delivery.controller";

const router = Router();
router.post("/", authMiddleware, createDelivery);

export default router;
