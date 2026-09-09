"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDelivery = createDelivery;
exports.updateDeliveryStatus = updateDeliveryStatus;
exports.assignDeliveryPartner = assignDeliveryPartner;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function createDelivery(req, res) {
    const { orderId, pickupLocation, destination } = req.body;
    const farmerId = req.user?.userId;
    if (!orderId || !pickupLocation || !destination) {
        return res.status(400).json({
            success: false,
            message: "Invalid data",
        });
    }
    const order = await prisma_js_1.default.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            delivery: true,
        },
    });
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }
    if (order.farmerId !== farmerId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized request",
        });
    }
    if (order.status !== "ACCEPTED") {
        return res.status(400).json({
            success: false,
            message: "Order must be ACCEPTED before creating delivery",
        });
    }
    if (order.delivery) {
        return res.status(400).json({
            success: false,
            message: "Delivery already exists for this order",
        });
    }
    const delivery = await prisma_js_1.default.delivery.create({
        data: {
            orderId,
            pickupLocation,
            destination,
        },
    });
    return res.status(201).json({
        success: true,
        message: "Delivery created successfully",
        delivery,
    });
}
async function updateDeliveryStatus(req, res) {
    const driverId = req.user?.userId;
    const { id } = req.params;
    const { status } = req.body;
    if (!driverId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    if (typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID",
        });
    }
    const delivery = await prisma_js_1.default.delivery.findUnique({
        where: {
            id,
        },
    });
    if (!delivery) {
        return res.status(404).json({
            success: false,
            message: "Delivery not found",
        });
    }
    // For now, only the assigned driver can update the delivery
    if (delivery.driverId !== driverId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized request",
        });
    }
    const allowedTransitions = {
        ASSIGNED: "PICKED_UP",
        PICKED_UP: "IN_TRANSIT",
        IN_TRANSIT: "DELIVERED",
    };
    if (allowedTransitions[delivery.status] !== status) {
        return res.status(400).json({
            success: false,
            message: `Invalid status transition: ${delivery.status} → ${status}`,
        });
    }
    const updatedDelivery = await prisma_js_1.default.delivery.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Delivery status updated successfully",
        delivery: updatedDelivery,
    });
}
async function assignDeliveryPartner(req, res) {
    const farmerId = req.user?.userId;
    const { id } = req.params;
    const { driverId } = req.body;
    if (!farmerId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    if (typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid delivery ID",
        });
    }
    if (!driverId) {
        return res.status(400).json({
            success: false,
            message: "driverId is required",
        });
    }
    const delivery = await prisma_js_1.default.delivery.findUnique({
        where: {
            id,
        },
        include: {
            order: true,
        },
    });
    if (!delivery) {
        return res.status(404).json({
            success: false,
            message: "Delivery not found",
        });
    }
    if (delivery.order.farmerId !== farmerId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized request",
        });
    }
    if (delivery.driverId) {
        return res.status(400).json({
            success: false,
            message: "Delivery partner already assigned",
        });
    }
    const driver = await prisma_js_1.default.user.findUnique({
        where: {
            id: driverId,
        },
    });
    if (!driver) {
        return res.status(404).json({
            success: false,
            message: "Delivery partner not found",
        });
    }
    if (driver.role !== "DELIVERY_PARTNER") {
        return res.status(400).json({
            success: false,
            message: "User is not a delivery partner",
        });
    }
    const updatedDelivery = await prisma_js_1.default.delivery.update({
        where: {
            id,
        },
        data: {
            driverId,
        },
    });
    return res.status(200).json({
        success: true,
        message: "Delivery partner assigned successfully",
        delivery: updatedDelivery,
    });
}
