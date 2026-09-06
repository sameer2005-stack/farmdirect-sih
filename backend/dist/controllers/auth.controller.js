"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const password_js_1 = __importDefault(require("../utils/password.js"));
async function register(req, res) {
    const { name, email, password, role, phone } = req.body;
    // Check if user already exists
    const existingUser = await prisma_js_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "User already exists",
        });
    }
    // Hash password
    const hashedPassword = await (0, password_js_1.default)(password);
    // Create user
    const user = await prisma_js_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone,
        },
    });
    // Never send password back to client
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        },
    });
}
