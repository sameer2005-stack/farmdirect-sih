"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    category: zod_1.z.string(),
    quantity: zod_1.z.number().positive(),
    unit: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    harvestDate: zod_1.z.string().optional(),
});
