"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = __importDefault(require("../middlewares/auth.middleware.js"));
const order_controller_js_1 = require("../controllers/order.controller.js");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_js_1.default, order_controller_js_1.createOrder);
router.get("/", auth_middleware_js_1.default, order_controller_js_1.getMyOrders);
router.get("/farmer", auth_middleware_js_1.default, order_controller_js_1.getFarmerOrders);
router.get("/:id/tracking", auth_middleware_js_1.default, order_controller_js_1.getOrderTracking);
router.get("/:id", auth_middleware_js_1.default, order_controller_js_1.getOrderById);
router.patch("/:id/status", auth_middleware_js_1.default, order_controller_js_1.updateOrderStatus);
exports.default = router;
