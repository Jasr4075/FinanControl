"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.refreshToken = void 0;
const TokenService_1 = require("../services/TokenService");
const UsuarioService_1 = require("../services/UsuarioService");
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ erro: 'Refresh token é obrigatório.' });
        const tokenObj = yield TokenService_1.TokenService.validarRefreshToken(refreshToken);
        if (!tokenObj)
            return res.status(401).json({ erro: 'Refresh token inválido ou expirado.' });
        const usuario = yield UsuarioService_1.UsuarioService.findById(tokenObj.userId);
        if (!usuario)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        // Rotação: revoga o refresh token antigo e gera um novo
        yield TokenService_1.TokenService.revogarRefreshToken(refreshToken);
        const novoRefreshToken = yield TokenService_1.TokenService.gerarRefreshToken(usuario.id);
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        res.json({ token, refreshToken: novoRefreshToken.token, user: usuario });
    }
    catch (err) {
        next(err);
    }
});
exports.refreshToken = refreshToken;
const revokeRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ erro: 'Refresh token é obrigatório.' });
        yield TokenService_1.TokenService.revogarRefreshToken(refreshToken);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.revokeRefreshToken = revokeRefreshToken;
