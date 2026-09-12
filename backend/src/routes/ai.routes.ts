import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getRecommendation,chatWithMandiSaarthi } from "../controllers/ai.controller.js";

const router = Router();

router.post(
  "/recommend",
  authMiddleware,
  getRecommendation,
);
router.post(
  "/chat",
  authMiddleware,
  chatWithMandiSaarthi,
);
export default router;