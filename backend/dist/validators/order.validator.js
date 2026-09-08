"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createOrderSchema = zod_1.default.object({
    items: zod_1.default
        .array(zod_1.default.object({
        productId: zod_1.default.string(),
        quantity: zod_1.default.number().positive(),
    }))
        .min(1),
    deliveryAddress: zod_1.default.string().min(5).max(100),
});
