"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`➡️ ${req.method} ${req.originalUrl}`);
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            console.log('📦 Body:', req.body);
        }
        next();
    });
}
(0, database_1.initDatabase)();
app.use(errorHandler_1.errorHandler);
exports.default = app;
