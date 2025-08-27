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
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const includeRelations = [
    { model: Conta_1.Conta, as: 'contaOrigem', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
    { model: Conta_1.Conta, as: 'contaDestino', attributes: ['id', 'bancoNome', 'agencia', 'conta'] },
];
exports.transferenciaService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.fromAccountId || !data.toAccountId || !data.amount) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            if (data.fromAccountId === data.toAccountId)
                throw new Error('Contas devem ser diferentes.');
            if (Number(data.amount) <= 0)
                throw new Error('Valor deve ser maior que zero.');
            return yield config_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const origem = yield Conta_1.Conta.findByPk(data.fromAccountId, { transaction: t, lock: t.LOCK.UPDATE });
                const destino = yield Conta_1.Conta.findByPk(data.toAccountId, { transaction: t, lock: t.LOCK.UPDATE });
                if (!origem || !destino)
                    throw new Error('Conta origem ou destino não encontrada.');
                if (Number(origem.saldo) < Number(data.amount))
                    throw new Error('Saldo insuficiente na conta de origem.');
                origem.saldo = Number(origem.saldo) - Number(data.amount);
                destino.saldo = Number(destino.saldo) + Number(data.amount);
                yield origem.save({ transaction: t });
                yield destino.save({ transaction: t });
                const novaTransferencia = yield Transferencia_1.Transferencia.create(Object.assign(Object.assign({}, data), { date: (_a = data.date) !== null && _a !== void 0 ? _a : new Date() }), { transaction: t });
                return yield Transferencia_1.Transferencia.findByPk(novaTransferencia.id, { include: includeRelations, transaction: t });
            }));
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transferencia_1.Transferencia.findAll({ include: includeRelations });
        });
    },
    list(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 20, dataInicio, dataFim, fromAccountId, toAccountId } = params;
            const where = {};
            if (dataInicio && dataFim)
                where.date = { [sequelize_1.Op.between]: [dataInicio, dataFim] };
            else if (dataInicio)
                where.date = { [sequelize_1.Op.gte]: dataInicio };
            else if (dataFim)
                where.date = { [sequelize_1.Op.lte]: dataFim };
            if (fromAccountId)
                where.fromAccountId = fromAccountId;
            if (toAccountId)
                where.toAccountId = toAccountId;
            const offset = (page - 1) * pageSize;
            const { rows, count } = yield Transferencia_1.Transferencia.findAndCountAll({ where, limit: pageSize, offset, order: [['date', 'DESC']], include: includeRelations });
            return { data: rows, total: count, page, pageSize, totalPages: Math.ceil(count / pageSize) };
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
            var _a, _b;
            // Atualizar transferência complexamente (ajuste saldos) poderia ser perigoso.
            // Implementação mínima: bloquear mudança de amount ou contas após criação.
            if (data.amount || data.fromAccountId || data.toAccountId) {
                throw new Error('Alteração de contas ou valor não suportada para manter integridade.');
            }
            const transferencia = yield Transferencia_1.Transferencia.findByPk(id);
            if (!transferencia)
                throw new Error('Transferência não encontrada.');
            yield transferencia.update({ date: (_a = data.date) !== null && _a !== void 0 ? _a : transferencia.date, description: (_b = data.description) !== null && _b !== void 0 ? _b : transferencia.description });
            return yield Transferencia_1.Transferencia.findByPk(id, { include: includeRelations });
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferencia = yield Transferencia_1.Transferencia.findByPk(id);
            if (!transferencia)
                throw new Error('Transferência não encontrada.');
            return yield config_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const origem = yield Conta_1.Conta.findByPk(transferencia.fromAccountId, { transaction: t, lock: t.LOCK.UPDATE });
                const destino = yield Conta_1.Conta.findByPk(transferencia.toAccountId, { transaction: t, lock: t.LOCK.UPDATE });
                if (origem && destino) {
                    // Reverter saldos
                    origem.saldo = Number(origem.saldo) + Number(transferencia.amount);
                    destino.saldo = Number(destino.saldo) - Number(transferencia.amount);
                    if (Number(destino.saldo) < 0)
                        throw new Error('Operação inválida: saldo destino ficaria negativo ao reverter.');
                    yield origem.save({ transaction: t });
                    yield destino.save({ transaction: t });
                }
                yield transferencia.destroy({ transaction: t });
                return { message: 'Transferência excluída com sucesso.' };
            }));
        });
    }
};
