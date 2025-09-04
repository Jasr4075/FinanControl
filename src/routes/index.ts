import { Router } from 'express';
import usuarioRoutes from './usuario.routes';
import despesaRoutes from './despesa.routes';
import cashbackRoutes from './cashback.routes';
import categoryRoutes from './category.routes';
import contaRoutes from './conta.routes';
import cartaoRoutes from './cartao.routes';
import metaRoutes from './meta.routes';
import faturaRoutes from './fatura.routes';
import parcelaRoutes from './parcela.routes';
import receitasRoutes from './receitas.routes';
import transacoesRecorrentesRoutes from './transacoesRecorrentes.routes';
import transferenciaRoutes from './transferencia.routes';
import notificacaoRoutes from './notificacao.routes';
import settingRoutes from './setting.routes';
import authRoutes from './auth.routes';
import refreshTokenRoutes from './refreshToken.routes';
import mercadopagoRoutes from './mercadopago.routes';

import { autenticarRequisicao } from '../middlewares/autenticacao';

const router = Router();


// Rutas de usuarios
router.use('/usuarios', usuarioRoutes);

// Rutas protegidas por JWT
router.use('/despesas', autenticarRequisicao, despesaRoutes);
router.use('/cashback', autenticarRequisicao, cashbackRoutes);
router.use('/categorias', autenticarRequisicao, categoryRoutes);
router.use('/contas', autenticarRequisicao, contaRoutes);
router.use('/cartoes', autenticarRequisicao, cartaoRoutes);
router.use('/metas', autenticarRequisicao, metaRoutes);
router.use('/faturas', autenticarRequisicao, faturaRoutes);
router.use('/parcelas', autenticarRequisicao, parcelaRoutes);
router.use('/receitas', autenticarRequisicao, receitasRoutes);
router.use('/transacoes-recorrentes', autenticarRequisicao, transacoesRecorrentesRoutes);
router.use('/transferencias', autenticarRequisicao, transferenciaRoutes);
router.use('/notificacoes', autenticarRequisicao, notificacaoRoutes);
router.use('/settings', autenticarRequisicao, settingRoutes);
router.use('/mercadopago', autenticarRequisicao, mercadopagoRoutes);

// Rutas públicas (login / registro / refresh)
router.use('/auth', authRoutes);
router.use('/token', refreshTokenRoutes);

export default router;
