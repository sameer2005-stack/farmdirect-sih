import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

export default router;