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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RefreshToken_1 = require("../models/RefreshToken");
const uuid_1 = require("uuid");
const secret = process.env.JWT_SECRET || 'supersecret';
class TokenService {
    static gerarToken(payload, expiresIn) {
        const exp = expiresIn || process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: exp });
    }
    static verificarToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (_a) {
            return null;
        }
    }
    // Gera e salva um refresh token para o usuário (não apaga outros tokens)
    static gerarRefreshToken(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, expiresInDays = 7) {
            const token = (0, uuid_1.v4)() + '.' + (0, uuid_1.v4)();
            const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
            return yield RefreshToken_1.RefreshToken.create({ token, userId, expiresAt });
        });
    }
    // Valida e retorna o refresh token se válido
    static validarRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield RefreshToken_1.RefreshToken.findOne({ where: { token } });
            if (!found || found.expiresAt < new Date())
                return null;
            return found;
        });
    }
    // Revoga (deleta) o refresh token
    static revogarRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield RefreshToken_1.RefreshToken.destroy({ where: { token } });
        });
    }
}
exports.TokenService = TokenService;
