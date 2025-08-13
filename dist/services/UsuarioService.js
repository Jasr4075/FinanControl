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
exports.UsuarioService = void 0;
const Usuario_1 = require("../models/Usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioService {
    // Remove campo hash antes de enviar para o cliente
    static sanitizeUser(usuario) {
        const userData = usuario.toJSON();
        delete userData.hash;
        return userData;
    }
    // Cria um usuário com senha criptografada
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, email, telefone, username, senha, role = 'CLIENT' } = data;
            const hash = yield bcrypt_1.default.hash(senha, 10);
            const usuario = yield Usuario_1.Usuario.create({
                nome,
                email,
                telefone,
                username,
                hash,
                role,
            });
            return this.sanitizeUser(usuario);
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield Usuario_1.Usuario.findAll();
            return usuarios.map(this.sanitizeUser);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield Usuario_1.Usuario.findByPk(id);
            if (!usuario)
                return null;
            return this.sanitizeUser(usuario);
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield Usuario_1.Usuario.findByPk(id);
            if (!usuario)
                throw new Error('Usuário não encontrado');
            const updateData = Object.assign({}, data);
            if (data.senha) {
                updateData.hash = yield bcrypt_1.default.hash(data.senha, 10);
                delete updateData.senha;
            }
            yield usuario.update(updateData);
            return this.sanitizeUser(usuario);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield Usuario_1.Usuario.findByPk(id);
            if (!usuario)
                throw new Error('Usuário não encontrado');
            yield usuario.destroy();
        });
    }
}
exports.UsuarioService = UsuarioService;
