"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
class AppError extends Error {
    constructor(message, statusCode = 500, detalhes) {
        super(message);
        this.statusCode = statusCode;
        this.detalhes = detalhes;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, _next) {
    console.error('🔥 Erro capturado pelo middleware:', err);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Erro interno do servidor.';
    let detalhes = err.detalhes;
    // Sequelize ValidationError
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Erro de validação';
        detalhes = err.errors.map((e) => ({
            campo: e.path,
            mensagem: e.message,
        }));
    }
    // Sequelize Unique Constraint Error
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = 'Erro de validação';
        detalhes = err.errors.map((e) => {
            let campo = e.path;
            let msg = 'Já está em uso';
            // Opcional: personalizar mensaje según campo
            if (campo === 'email')
                msg = 'Email já está em uso';
            if (campo === 'username')
                msg = 'Username já está em uso';
            if (campo === 'telefone')
                msg = 'Telefone já está em uso';
            return { campo, mensagem: msg };
        });
    }
    res.status(statusCode).json({ erro: message, detalhes });
}
