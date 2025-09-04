"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_routes_1 = __importDefault(require("./usuario.routes"));
const despesa_routes_1 = __importDefault(require("./despesa.routes"));
const cashback_routes_1 = __importDefault(require("./cashback.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const conta_routes_1 = __importDefault(require("./conta.routes"));
const cartao_routes_1 = __importDefault(require("./cartao.routes"));
const meta_routes_1 = __importDefault(require("./meta.routes"));
const fatura_routes_1 = __importDefault(require("./fatura.routes"));
const parcela_routes_1 = __importDefault(require("./parcela.routes"));
const receitas_routes_1 = __importDefault(require("./receitas.routes"));
const transacoesRecorrentes_routes_1 = __importDefault(require("./transacoesRecorrentes.routes"));
const transferencia_routes_1 = __importDefault(require("./transferencia.routes"));
const notificacao_routes_1 = __importDefault(require("./notificacao.routes"));
const setting_routes_1 = __importDefault(require("./setting.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const refreshToken_routes_1 = __importDefault(require("./refreshToken.routes"));
const autenticacao_1 = require("../middlewares/autenticacao");
const router = (0, express_1.Router)();
// Rutas de usuarios
router.use('/usuarios', usuario_routes_1.default);
// Rutas protegidas por JWT
router.use('/despesas', autenticacao_1.autenticarRequisicao, despesa_routes_1.default);
router.use('/cashback', autenticacao_1.autenticarRequisicao, cashback_routes_1.default);
router.use('/categorias', autenticacao_1.autenticarRequisicao, category_routes_1.default);
router.use('/contas', autenticacao_1.autenticarRequisicao, conta_routes_1.default);
router.use('/cartoes', autenticacao_1.autenticarRequisicao, cartao_routes_1.default);
router.use('/metas', autenticacao_1.autenticarRequisicao, meta_routes_1.default);
router.use('/faturas', autenticacao_1.autenticarRequisicao, fatura_routes_1.default);
router.use('/parcelas', autenticacao_1.autenticarRequisicao, parcela_routes_1.default);
router.use('/receitas', autenticacao_1.autenticarRequisicao, receitas_routes_1.default);
router.use('/transacoes-recorrentes', autenticacao_1.autenticarRequisicao, transacoesRecorrentes_routes_1.default);
router.use('/transferencias', autenticacao_1.autenticarRequisicao, transferencia_routes_1.default);
router.use('/notificacoes', autenticacao_1.autenticarRequisicao, notificacao_routes_1.default);
router.use('/settings', autenticacao_1.autenticarRequisicao, setting_routes_1.default);
// Rutas públicas (login / registro / refresh)
router.use('/auth', auth_routes_1.default);
router.use('/token', refreshToken_routes_1.default);
exports.default = router;
