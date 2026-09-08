"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = __importDefault(require("../middlewares/auth.middleware.js"));
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_js_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated",
        user: req.user,
    });
});
exports.default = router;
