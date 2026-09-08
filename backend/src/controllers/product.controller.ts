import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export async function createProduct(req: Request, res: Response) {
  const { name, category, quantity, unit, price, harvestDate } = req.body;

  const farmerId = req.user?.userId;

  if (!farmerId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const product = await prisma.product.create({
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

export async function getProducts(req: Request, res: Response) {
  const products = await prisma.product.findMany({
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

export async function updateProduct(req: Request, res: Response) {
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

  const product = await prisma.product.findFirst({
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
  const updateData: {
    name?: string;
    category?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    harvestDate?: Date | null;
  } = {};

  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (quantity !== undefined) updateData.quantity = quantity;
  if (unit !== undefined) updateData.unit = unit;
  if (price !== undefined) updateData.price = price;

  if (harvestDate !== undefined) {
    updateData.harvestDate = harvestDate ? new Date(harvestDate) : null;
  }

  const updatedProduct = await prisma.product.update({
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

export async function deleteProduct(req: Request, res: Response) {
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

  const product = await prisma.product.findFirst({
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

  await prisma.product.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
}
