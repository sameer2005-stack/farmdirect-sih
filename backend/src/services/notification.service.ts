import prisma from "../config/prisma.js";

export async function createNotification(
  userId: string,
  message: string,
  type: string
) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    },
  });

  return notification;
}