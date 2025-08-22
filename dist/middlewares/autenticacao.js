"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarRequisicao = autenticarRequisicao;
const TokenService_1 = require("../services/TokenService");
function autenticarRequisicao(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')))
        return res.status(401).json({ erro: 'Token ausente ou malformado.' });
    const token = authHeader.split(' ')[1];
    const payload = TokenService_1.TokenService.verificarToken(token);
    if (!payload)
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    req.user = payload;
    next();
}
