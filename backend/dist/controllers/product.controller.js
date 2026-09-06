"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function createProduct(req, res) {
    const { name, category, quantity, unit, price, harvestDate, } = req.body;
    const farmerId = req.user?.userId;
    if (!farmerId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    const product = await prisma_js_1.default.product.create({
        data: {
            farmerId,
            name,
            category,
            quantity,
            unit,
            price,
            harvestDate: harvestDate ? new Date(harvestDate) : null,
        },
    });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
}
