"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const delivery_controller_1 = require("../controllers/delivery.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.default, delivery_controller_1.createDelivery);
router.patch("/:id/assign", auth_middleware_1.default, delivery_controller_1.assignDeliveryPartner);
router.patch("/:id/status", auth_middleware_1.default, delivery_controller_1.updateDeliveryStatus);
exports.default = router;
