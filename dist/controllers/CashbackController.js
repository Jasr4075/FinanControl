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
const createCashback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashback = yield CashbackService_1.CashbackService.create(req.body);
        res.status(201).json({ success: true, data: cashback });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createCashback = createCashback;
const getCashbacks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashbacks = yield CashbackService_1.CashbackService.findAll();
        res.status(200).json({ success: true, data: cashbacks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCashbacks = getCashbacks;
const getCashbackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashback = yield CashbackService_1.CashbackService.findById(req.params.id);
        if (!cashback)
            return res.status(404).json({ success: false, message: 'Cashback não encontrado.' });
        res.status(200).json({ success: true, data: cashback });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCashbackById = getCashbackById;
const updateCashback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashback = yield CashbackService_1.CashbackService.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: cashback });
    }
    catch (error) {
        if (error.message === 'Cashback não encontrado.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateCashback = updateCashback;
const deleteCashback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CashbackService_1.CashbackService.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Cashback excluído com sucesso.' });
    }
    catch (error) {
        if (error.message === 'Cashback não encontrado.') {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteCashback = deleteCashback;
