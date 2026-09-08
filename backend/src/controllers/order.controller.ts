import { Request, Response } from "express";

import { createOrderSchema } from "../validators/order.validator.js";

import prisma from "../config/prisma.js";
import { success } from "zod";

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
