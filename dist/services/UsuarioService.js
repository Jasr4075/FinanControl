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
const Conta_1 = require("../models/Conta");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const errorHandler_1 = require("../middlewares/errorHandler");
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
            return yield config_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                // 1️⃣ Cria o usuário
                const usuario = yield Usuario_1.Usuario.create({
                    nome,
                    email,
                    telefone,
                    username,
                    hash,
                    role,
                }, { transaction: t });
                // 2️⃣ Cria a conta EFETIVO
                yield Conta_1.Conta.create({
                    userId: usuario.id,
                    type: 'EFETIVO',
                    bancoNome: 'Dinheiro Físico',
                    agencia: '0001',
                    conta: '000000-0',
                    saldo: 0,
                    efetivo: true,
                    cdiPercent: 0,
                }, { transaction: t });
                return this.sanitizeUser(usuario);
            }));
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
                throw new errorHandler_1.AppError('Usuário não encontrado.', 404);
            return this.sanitizeUser(usuario);
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield Usuario_1.Usuario.findByPk(id);
            if (!usuario)
                throw new errorHandler_1.AppError('Usuário não encontrado.', 404);
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
                throw new errorHandler_1.AppError('Usuário não encontrado.', 404);
            yield usuario.destroy();
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield Usuario_1.Usuario.findOne({ where: { username } });
            return usuario ? this.sanitizeUser(usuario) : null;
        });
    }
    static findByUsernameRaw(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Usuario_1.Usuario.scope('withHash').findOne({ where: { username } });
        });
    }
}
exports.UsuarioService = UsuarioService;
