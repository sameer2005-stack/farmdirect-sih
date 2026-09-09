import { Request, Response } from "express";

import { createOrderSchema } from "../validators/order.validator.js";

import prisma from "../config/prisma.js";
import { success } from "zod";
import { createNotification } from "../services/notification.service.js";

export async function createOrder(req: Request, res: Response) {
  const buyerId = req.user?.userId;

  if (!buyerId) {
    return res.status(401).json({
      success: false,

      message: "Authentication required",
    });
  }

  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,

      message: "Invalid input",

      errors: result.error.issues,
    });
  }

  const { items, deliveryAddress } = result.data;

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (productIds.length !== products.length) {
    return res.status(404).json({
      msg: "product not found",
    });
  }

  for (const item of items) {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return res.status(404).json({
        msg: "product not found",
      });
    }
  }

  const farmerId = products[0].farmerId;

  const sameFarmer = products.every((product) => product.farmerId === farmerId);

  if (!sameFarmer) {
    return res.status(400).json({
      success: false,

      message: "All products must belong to the same farmer",
    });
  }

  let totalAmount = 0;

  for (const item of items) {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return res.status(404).json({
        msg: "product not found",
      });
    }

    const costOfItem = product.price * item.quantity;

    totalAmount += costOfItem;
  }

  const orderItems: {
    productId: string;
    quantity: number;
    price: number;
  }[] = [];
  for (const item of items) {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const orderItem = {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
    orderItems.push(orderItem);
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // database operations here
      const orderPlacing = await tx.order.create({
        data: {
          buyerId,
          farmerId,
          totalAmount,
          deliveryAddress,
          items: {
            create: orderItems,
          },
        },
      });
      for (const item of items) {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        const updated = await tx.product.updateMany({
          where: {
            id: product!.id,
            quantity: {
              gte: item.quantity,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
        if (updated.count === 0) {
          throw new Error("Insufficient stock");
        }
      }
      return orderPlacing;
    });
    await createNotification(farmerId, "You received a new order", "NEW_ORDER");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Insufficient stock") {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    throw error;
  }
}

export async function getMyOrders(req: Request, res: Response) {
  const buyerId = req.user?.userId;

  if (!buyerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      buyerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
}

export async function getOrderById(req: Request, res: Response) {
  const buyerId = req.user?.userId;
  const { id } = req.params;

  if (!buyerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      buyerId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      msg: "Order not found!!",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Order retrieved successfully",
    order,
  });
}

export async function getFarmerOrders(req: Request, res: Response) {
  const farmerId = req.user?.userId;

  if (!farmerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      farmerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const farmerId = req.user?.userId;
  const { id } = req.params;
  const { status } = req.body;

  if (!farmerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  if (status !== "ACCEPTED" && status !== "REJECTED") {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Only ACCEPTED or REJECTED are allowed.",
    });
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      farmerId,
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  if (order.status !== "PENDING") {
    return res.status(400).json({
      success: false,
      message: "Only pending orders can be accepted or rejected",
    });
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status,
    },
  });
  await createNotification(
    order.buyerId,
    status === "ACCEPTED"
      ? "Your order has been accepted by the farmer"
      : "Your order has been rejected by the farmer",
    status === "ACCEPTED" ? "ORDER_ACCEPTED" : "ORDER_REJECTED",
  );

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: updatedOrder,
  });
}

export async function getOrderTracking(req: Request, res: Response) {
  const buyerId = req.user?.userId;
  const { id } = req.params;

  if (!buyerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      buyerId,
    },
    include: {
      delivery: {
        select: {
          id: true,
          status: true,
          pickupLocation: true,
          destination: true,
          estimatedTime: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    tracking: {
      orderId: order.id,
      orderStatus: order.status,
      delivery: order.delivery,
    },
  });
}
