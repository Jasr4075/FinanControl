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
exports.ContaService = void 0;
const Conta_1 = require("../models/Conta");
const Usuario_1 = require("../models/Usuario");
const includeRelations = [
    { model: Usuario_1.Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
];
class ContaService {
    // Cria uma nova conta validando campos obrigatórios e usando defaults
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, type, bancoNome, agencia, conta, saldo = 0, efetivo = false, cdiPercent = 0 } = data;
            // Validação simples, poderia ser expandida
            if (!userId || !type || !bancoNome || !agencia || !conta) {
                throw new Error('Campos obrigatórios não preenchidos.');
            }
            const novaConta = yield Conta_1.Conta.create({
                userId,
                type,
                bancoNome,
                agencia,
                conta,
                saldo,
                efetivo,
                cdiPercent,
            });
            // Retorna conta com dados do usuário relacionado
            return yield Conta_1.Conta.findByPk(novaConta.id, { include: includeRelations });
        });
    }
    // Retorna todas as contas com os usuários relacionados
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Conta_1.Conta.findAll({ include: includeRelations });
        });
    }
    // Busca conta por ID com usuário relacionado
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Conta_1.Conta.findByPk(id, { include: includeRelations });
        });
    }
    // Atualiza conta por ID, retornando conta atualizada com usuário
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const conta = yield Conta_1.Conta.findByPk(id);
            if (!conta)
                throw new Error('Conta não encontrada.');
            yield conta.update(data);
            return yield Conta_1.Conta.findByPk(id, { include: includeRelations });
        });
    }
    // Exclui conta por ID
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conta = yield Conta_1.Conta.findByPk(id);
            if (!conta)
                throw new Error('Conta não encontrada.');
            yield conta.destroy();
        });
    }
}
exports.ContaService = ContaService;
