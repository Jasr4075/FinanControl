"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'supersecret';
class TokenService {
    static gerarToken(payload, expiresIn = '1h') {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    static verificarToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.TokenService = TokenService;
