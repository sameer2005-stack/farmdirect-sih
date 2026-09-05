"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
app_js_1.default.listen(env_js_1.PORT, () => {
    console.log(`FarmDirect server running on port ${env_js_1.PORT}`);
});
