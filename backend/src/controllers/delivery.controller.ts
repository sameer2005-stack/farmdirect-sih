import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export async function createDelivery(req: Request, res: Response) {
  const { orderId, pickupLocation, destination } = req.body;
  const farmerId = req.user?.userId;

  if (!orderId || !pickupLocation || !destination) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
    });
  }

  const order = await prisma.order.findUnique({
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

  const delivery = await prisma.delivery.create({
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
