import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export async function getMyNotifications(
  req: Request,
  res: Response
) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  });
}