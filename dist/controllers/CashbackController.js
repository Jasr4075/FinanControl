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
exports.deleteCashback = exports.updateCashback = exports.getCashbackById = exports.getCashbacks = exports.createCashback = void 0;
const CashbackService_1 = require("../services/CashbackService");
const cashback_schema_1 = require("../validators/cashback.schema");
const zod_1 = require("zod");
// --- Criar cashback ---
const createCashback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCashback = cashback_schema_1.cashbackCreateSchema.parse(req.body);
        const cashback = yield CashbackService_1.CashbackService.create(validatedCashback);
        res.status(201).json({ success: true, data: cashback });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.createCashback = createCashback;
// --- Listar todos ---
const getCashbacks = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashbacks = yield CashbackService_1.CashbackService.findAll();
        res.status(200).json({ success: true, data: cashbacks });
    }
    catch (error) {
        next(error);
    }
});
exports.getCashbacks = getCashbacks;
// --- Buscar por ID ---
const getCashbackById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashback = yield CashbackService_1.CashbackService.findById(req.params.id);
        if (!cashback)
            return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
        res.status(200).json({ success: true, data: cashback });
    }
    catch (error) {
        next(error);
    }
});
exports.getCashbackById = getCashbackById;
// --- Atualizar ---
const updateCashback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedCashback = cashback_schema_1.cashbackUpdateSchema.parse(req.body);
        const cashback = yield CashbackService_1.CashbackService.update(req.params.id, validatedCashback);
        if (!cashback)
            return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
        res.status(200).json({ success: true, data: cashback });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
});
exports.updateCashback = updateCashback;
// --- Deletar ---
const deleteCashback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield CashbackService_1.CashbackService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
        res.status(200).json({ success: true, message: 'Cashback excluído com sucesso.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCashback = deleteCashback;
