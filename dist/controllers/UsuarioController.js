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
const createUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioService_1.UsuarioService.create(req.body);
        res.status(201).json({ success: true, data: usuario });
    }
    catch (err) {
        next(err);
    }
});
exports.createUsuario = createUsuario;
const getUsuarios = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield UsuarioService_1.UsuarioService.findAll();
        res.status(200).json({ success: true, data: usuarios });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsuarios = getUsuarios;
const getUsuarioById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioService_1.UsuarioService.findById(req.params.id);
        res.status(200).json({ success: true, data: usuario });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsuarioById = getUsuarioById;
const updateUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioService_1.UsuarioService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: usuario });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUsuario = updateUsuario;
const deleteUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UsuarioService_1.UsuarioService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUsuario = deleteUsuario;
