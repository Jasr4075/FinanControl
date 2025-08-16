"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const erros = result.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensagem: err.message,
        }));
        return next(new errorHandler_1.AppError('Erro de validação', 400, erros));
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
