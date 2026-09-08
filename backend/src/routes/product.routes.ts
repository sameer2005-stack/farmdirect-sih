import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

const router = Router();

router.post("/", authMiddleware, validate(createProductSchema), createProduct);
router.get("/", getProducts);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateProductSchema),
  updateProduct,
);
router.delete("/:id", authMiddleware, deleteProduct);
export default router;
