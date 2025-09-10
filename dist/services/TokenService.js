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
const uuid_1 = require("uuid");
const redisClient_1 = require("../redisClient");
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
    // Agora gera refresh token em Redis
    static gerarRefreshToken(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, expiresInDays = 7) {
            const token = (0, uuid_1.v4)() + "." + (0, uuid_1.v4)();
            const ttl = expiresInDays * 24 * 60 * 60; // segundos
            yield redisClient_1.redisClient.set(`refresh:${token}`, userId, { EX: ttl });
            return { token };
        });
    }
    // Valida e retorna o refresh token se válido
    static validarRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield redisClient_1.redisClient.get(`refresh:${token}`);
            if (!userId)
                return null;
            return userId ? { userId } : null;
        });
    }
    // Revoga (deleta) o refresh token
    static revogarRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redisClient_1.redisClient.del(`refresh:${token}`);
        });
    }
}
exports.TokenService = TokenService;
