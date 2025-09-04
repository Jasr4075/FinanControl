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
exports.callbackMercadoPago = exports.loginMercadoPago = exports.loginUsuario = exports.registerUsuario = void 0;
const axios_1 = __importDefault(require("axios"));
const UsuarioService_1 = require("../services/UsuarioService");
const Usuario_1 = require("../models/Usuario");
const TokenService_1 = require("../services/TokenService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_schema_1 = require("../validators/usuario.schema");
const zod_1 = require("zod");
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
        // Validação simples para login
        const loginSchema = zod_1.z.object({
            username: zod_1.z.string().min(1, "Username é obrigatório"),
            senha: zod_1.z.string().min(1, "Senha é obrigatória"),
        });
        const { username, senha } = loginSchema.parse(req.body);
        const usuario = yield UsuarioService_1.UsuarioService.findByUsernameRaw(username);
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        }
        const senhaValida = yield bcrypt_1.default.compare(senha, usuario.hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        }
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        const refreshToken = yield TokenService_1.TokenService.gerarRefreshToken(usuario.id);
        res.json({ token, refreshToken: refreshToken.token, user: UsuarioService_1.UsuarioService.sanitizeUser(usuario) });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: err.errors });
        }
        next(err);
    }
});
exports.loginUsuario = loginUsuario;
const loginMercadoPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUri = process.env.MP_REDIRECT_URI;
    const clientId = process.env.MP_CLIENT_ID;
    const authUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}`;
    res.json({ url: authUrl });
});
exports.loginMercadoPago = loginMercadoPago;
const callbackMercadoPago = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { code } = req.query;
        if (!code)
            return res.status(400).json({ erro: 'Código de autorização não encontrado' });
        const tokenUrl = 'https://api.mercadopago.com/oauth/token';
        const response = yield axios_1.default.post(tokenUrl, {
            grant_type: 'authorization_code',
            client_id: process.env.MP_CLIENT_ID,
            client_secret: process.env.MP_CLIENT_SECRET,
            code,
            redirect_uri: process.env.MP_REDIRECT_URI,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const { access_token, refresh_token, expires_in, user_id } = response.data;
        // Exemplo: pegar usuário autenticado (podes usar JWT para identificar quem está logado)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // se tiver middleware de autenticação
        if (!userId)
            return res.status(401).json({ erro: 'Usuário não autenticado' });
        const usuario = yield Usuario_1.Usuario.findByPk(userId);
        if (!usuario)
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        usuario.mp_access_token = access_token;
        usuario.mp_refresh_token = refresh_token;
        usuario.mp_expires_in = new Date(Date.now() + expires_in * 1000);
        yield usuario.save();
        res.json({ sucesso: true, usuario });
    }
    catch (err) {
        next(err);
    }
});
exports.callbackMercadoPago = callbackMercadoPago;
