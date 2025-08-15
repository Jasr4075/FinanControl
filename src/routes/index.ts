import { Router } from 'express';
import usuarioRoutes from './usuario.routes'
import despesaRoutes from './despesa.routes'
import cashbackRoutes from './cashback.routes';
import categoryRoutes from './category.routes';
import contaRoutes from './conta.routes';
import cartaoRoutes from './cartao.routes'
import metaRoutes from './meta.routes';
import faturaRoutes from './fatura.routes';
import parcelaRoutes from './parcela.routes'
import receitasRoutes from './receitas.routes'
import transacoesRecorrentesRoutes from './transacoesRecorrentes.routes';
import transferenciaRoutes from './transferencia.routes';
import notificacaoRoutes from './notificacao.routes';
import settingRoutes from './setting.routes';
import authRoutes from './auth.routes';


const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/despesas', despesaRoutes);
router.use('/cashback', cashbackRoutes);
router.use('/categorias', categoryRoutes);
router.use('/contas', contaRoutes);
router.use('/cartoes', cartaoRoutes);
router.use('/metas', metaRoutes);
router.use('/faturas', faturaRoutes);
router.use('/parcelas', parcelaRoutes);
router.use('/receitas', receitasRoutes);
router.use('/transacoes-recorrentes', transacoesRecorrentesRoutes);
router.use('/transferencias', transferenciaRoutes);
router.use('/notificacoes', notificacaoRoutes);
router.use('/settings', settingRoutes);
router.use('/auth', authRoutes);

export default router;


