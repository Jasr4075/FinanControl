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
exports.transferenciaService = void 0;
const Transferencia_1 = require("../models/Transferencia");
const Conta_1 = require("../models/Conta");
const includeRelations = [
    { model: Conta_1.Conta, as: 'contaOrigem', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
    { model: Conta_1.Conta, as: 'contaDestino', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
];
exports.transferenciaService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!data.fromAccountId || !data.toAccountId || !data.amount) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novaTransferencia = yield Transferencia_1.Transferencia.create(Object.assign(Object.assign({}, data), { date: (_a = data.date) !== null && _a !== void 0 ? _a : new Date() }));
            return yield Transferencia_1.Transferencia.findByPk(novaTransferencia.id, { include: includeRelations });
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transferencia_1.Transferencia.findAll({ include: includeRelations });
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferencia = yield Transferencia_1.Transferencia.findByPk(id, { include: includeRelations });
            if (!transferencia)
                throw new Error('Transferência não encontrada.');
            return transferencia;
        });
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferencia = yield Transferencia_1.Transferencia.findByPk(id);
            if (!transferencia)
                throw new Error('Transferência não encontrada.');
            yield transferencia.update(data);
            return yield Transferencia_1.Transferencia.findByPk(id, { include: includeRelations });
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferencia = yield Transferencia_1.Transferencia.findByPk(id);
            if (!transferencia)
                throw new Error('Transferência não encontrada.');
            yield transferencia.destroy();
            return { message: 'Transferência excluída com sucesso.' };
        });
    }
};
