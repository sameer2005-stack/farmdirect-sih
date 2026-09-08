"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
function generateToken(userId) {
    const token = jsonwebtoken_1.default.sign({ userId }, env_js_1.JWT_SECRET, { expiresIn: "7d" });
    return token;
}
