"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
async function createNotification(userId, message, type) {
    const notification = await prisma_js_1.default.notification.create({
        data: {
            userId,
            message,
            type,
        },
    });
    return notification;
}
