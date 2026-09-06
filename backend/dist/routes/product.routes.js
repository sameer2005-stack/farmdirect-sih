"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_js_1 = require("../controllers/product.controller.js");
const auth_middleware_js_1 = __importDefault(require("../middlewares/auth.middleware.js"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_js_1.default, product_controller_js_1.createProduct);
router.get("/", product_controller_js_1.getProducts);
exports.default = router;
