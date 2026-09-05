"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_js_1 = require("../generated/prisma/client.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString,
});
const prisma = new client_js_1.PrismaClient({ adapter });
exports.default = prisma;
