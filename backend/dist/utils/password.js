"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hashPassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashPassword(password) {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return hashedPassword;
}
