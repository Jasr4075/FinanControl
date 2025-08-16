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
const registerUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioService_1.UsuarioService.create(req.body);
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        res.status(201).json({ user: usuario, token });
    }
    catch (err) {
        next(err);
    }
});
exports.registerUsuario = registerUsuario;
const loginUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, senha } = req.body;
        const usuario = yield UsuarioService_1.UsuarioService.findByUsernameRaw(username);
        if (!usuario)
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        const senhaValida = yield bcrypt_1.default.compare(senha, usuario.hash);
        if (!senhaValida)
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        const token = TokenService_1.TokenService.gerarToken({
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
        });
        res.json({ token, user: UsuarioService_1.UsuarioService.sanitizeUser(usuario) });
    }
    catch (err) {
        next(err);
    }
});
exports.loginUsuario = loginUsuario;
