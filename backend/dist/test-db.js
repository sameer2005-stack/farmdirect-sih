"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("./config/prisma.js"));
async function testDatabase() {
    const users = await prisma_js_1.default.user.findMany();
    console.log(users);
    await prisma_js_1.default.$disconnect();
}
testDatabase();
