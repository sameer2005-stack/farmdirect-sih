"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_js_1 = __importDefault(require("./middlewares/error.middleware.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const delivery_routes_js_1 = __importDefault(require("./routes/delivery.routes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/users", user_routes_js_1.default);
app.use("/api/products", product_routes_js_1.default);
app.use("/api/orders", order_routes_js_1.default);
app.use("/api/delivery", delivery_routes_js_1.default);
app.get("/", (req, res) => {
    res.send("FarmDirect backend is running!");
});
app.use(error_middleware_js_1.default);
exports.default = app;
