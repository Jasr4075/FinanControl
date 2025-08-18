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
exports.deleteConta = exports.updateConta = exports.getContaById = exports.getContas = exports.createConta = void 0;
const ContaService_1 = require("../services/ContaService");
const conta_schema_1 = require("../validators/conta.schema");
const createConta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // valida entrada com zod
        const data = conta_schema_1.contaCreateSchema.parse(req.body);
        const conta = yield ContaService_1.ContaService.create(data);
        res.status(201).json({ success: true, data: conta });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createConta = createConta;
const getContas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contas = yield ContaService_1.ContaService.findAll();
        res.status(200).json({ success: true, data: contas });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getContas = getContas;
const getContaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conta = yield ContaService_1.ContaService.findById(req.params.id);
        if (!conta)
            return res.status(404).json({ success: false, message: 'Conta não encontrada.' });
        res.status(200).json({ success: true, data: conta });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getContaById = getContaById;
const updateConta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // valida entrada com zod
        const data = conta_schema_1.contaUpdateSchema.parse(req.body);
        const conta = yield ContaService_1.ContaService.update(req.params.id, data);
        res.status(200).json({ success: true, data: conta });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        if (error.message === 'Conta não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateConta = updateConta;
const deleteConta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ContaService_1.ContaService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Conta excluída com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Conta não encontrada.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteConta = deleteConta;
