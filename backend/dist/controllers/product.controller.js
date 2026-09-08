"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function createProduct(req, res) {
    const { name, category, quantity, unit, price, harvestDate } = req.body;
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
async function getProducts(req, res) {
    const products = await prisma_js_1.default.product.findMany({
        where: {
            status: "AVAILABLE",
        },
        include: {
            farmer: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
}
async function updateProduct(req, res) {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
    const farmerId = req.user?.userId;
    if (!farmerId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    const product = await prisma_js_1.default.product.findFirst({
        where: {
            id,
            farmerId,
        },
    });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    const { name, category, quantity, unit, price, harvestDate } = req.body;
    const updateData = {};
    if (name !== undefined)
        updateData.name = name;
    if (category !== undefined)
        updateData.category = category;
    if (quantity !== undefined)
        updateData.quantity = quantity;
    if (unit !== undefined)
        updateData.unit = unit;
    if (price !== undefined)
        updateData.price = price;
    if (harvestDate !== undefined) {
        updateData.harvestDate = harvestDate ? new Date(harvestDate) : null;
    }
    const updatedProduct = await prisma_js_1.default.product.update({
        where: {
            id,
        },
        data: updateData,
    });
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
    });
}
async function deleteProduct(req, res) {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
    const farmerId = req.user?.userId;
    if (!farmerId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    const product = await prisma_js_1.default.product.findFirst({
        where: {
            id,
            farmerId,
        },
    });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    await prisma_js_1.default.product.delete({
        where: {
            id,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
}
