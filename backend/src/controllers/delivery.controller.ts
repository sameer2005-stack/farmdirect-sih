import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createNotification } from "../services/notification.service.js";

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
  await createNotification(
    order.buyerId,
    "Delivery has been created for your order",
    "DELIVERY_CREATED",
  );

  return res.status(201).json({
    success: true,
    message: "Delivery created successfully",
    delivery,
  });
}

export async function updateDeliveryStatus(req: Request, res: Response) {
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

  const delivery = await prisma.delivery.findUnique({
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

  // For now, only the assigned driver can update the delivery
  if (delivery.driverId !== driverId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const allowedTransitions: Record<string, string> = {
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

  const updatedDelivery = await prisma.delivery.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  await createNotification(
    delivery.order.buyerId,
    `Your delivery status is now ${status}`,
    "DELIVERY_STATUS_UPDATED",
  );

  return res.status(200).json({
    success: true,
    message: "Delivery status updated successfully",
    delivery: updatedDelivery,
  });
}

export async function assignDeliveryPartner(req: Request, res: Response) {
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

  const delivery = await prisma.delivery.findUnique({
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

  const driver = await prisma.user.findUnique({
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

  const updatedDelivery = await prisma.delivery.update({
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
