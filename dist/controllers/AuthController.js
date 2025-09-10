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
exports.loginUsuario = exports.registerUsuario = void 0;
const UsuarioService_1 = require("../services/UsuarioService");
const TokenService_1 = require("../services/TokenService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_schema_1 = require("../validators/usuario.schema");
const zod_1 = require("zod");
const redisCache_1 = require("../helpers/redisCache");
// --- Cadastro ---
const registerUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Valida com Zod
        const parsedData = usuario_schema_1.usuarioCreateSchema.parse(req.body);
        const usuario = yield UsuarioService_1.UsuarioService.create(parsedData);
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        const refreshToken = yield TokenService_1.TokenService.gerarRefreshToken(usuario.id);
        res.status(201).json({ user: usuario, token, refreshToken: refreshToken.token });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: err.errors });
        }
        next(err);
    }
});
exports.registerUsuario = registerUsuario;
// --- Login ---
const loginUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginSchema = zod_1.z.object({
            username: zod_1.z.string().min(1, "Username é obrigatório"),
            senha: zod_1.z.string().min(1, "Senha é obrigatória"),
        });
        const { username, senha } = loginSchema.parse(req.body);
        // 🔥 Busca o usuário no Redis antes de ir ao Postgres
        const usuario = yield (0, redisCache_1.getUserCached)(username);
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }
        // Valida senha
        const senhaValida = yield bcrypt_1.default.compare(senha, usuario.hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }
        // Gera tokens
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        const refreshToken = yield TokenService_1.TokenService.gerarRefreshToken(usuario.id);
        res.json({
            token,
            refreshToken: refreshToken.token,
            user: UsuarioService_1.UsuarioService.sanitizeUser(usuario),
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: err.errors });
        }
        next(err);
    }
});
exports.loginUsuario = loginUsuario;
