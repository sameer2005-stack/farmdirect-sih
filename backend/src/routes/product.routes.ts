import { Router } from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createProductSchema } from "../validators/product.validator.js";

const router = Router();

router.post("/", authMiddleware, validate(createProductSchema), createProduct);
router.get("/", getProducts);
export default router;
