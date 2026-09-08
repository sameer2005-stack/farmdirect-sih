"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
exports.login = login;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const password_js_1 = __importDefault(require("../utils/password.js"));
const comparePassword_js_1 = __importDefault(require("../utils/comparePassword.js"));
const generateToken_js_1 = __importDefault(require("../utils/generateToken.js"));
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
async function login(req, res) {
    const { email, password } = req.body;
    // Find user
    const user = await prisma_js_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    // Compare password
    const isMatch = await (0, comparePassword_js_1.default)(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    // Generate JWT
    const token = (0, generateToken_js_1.default)(user.id);
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        },
    });
}
