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
exports.deleteUsuario = exports.updateUsuario = exports.getUsuarioById = exports.getUsuarios = exports.createUsuario = void 0;
const UsuarioService_1 = require("../services/UsuarioService");
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, telefone, username, senha, role } = req.body;
    try {
        if (!nome || !email || !telefone || !username || !senha) {
            return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }
        const usuario = yield UsuarioService_1.UsuarioService.create({ nome, email, telefone, username, senha, role });
        res.status(201).json({ success: true, data: usuario });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createUsuario = createUsuario;
const getUsuarios = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield UsuarioService_1.UsuarioService.findAll();
        res.status(200).json({ success: true, data: usuarios });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUsuarios = getUsuarios;
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield UsuarioService_1.UsuarioService.findById(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ success: true, data: usuario });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUsuarioById = getUsuarioById;
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nome, email, telefone, username, senha, role } = req.body;
    try {
        const usuario = yield UsuarioService_1.UsuarioService.update(id, { nome, email, telefone, username, senha, role });
        res.status(200).json({ success: true, data: usuario });
    }
    catch (error) {
        if (error.message === 'Usuário não encontrado') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateUsuario = updateUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield UsuarioService_1.UsuarioService.delete(id);
        res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Usuário não encontrado') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteUsuario = deleteUsuario;
