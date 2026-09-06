import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export async function createProduct(req: Request, res: Response) {
  const {
    name,
    category,
    quantity,
    unit,
    price,
    harvestDate,
  } = req.body;

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