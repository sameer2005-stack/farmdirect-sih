"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
}
