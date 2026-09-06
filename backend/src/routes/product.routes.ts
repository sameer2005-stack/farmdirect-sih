import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createProduct);

export default router;