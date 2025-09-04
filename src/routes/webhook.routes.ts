import { Router } from 'express'
import { WebhookController } from '../controllers/WebhookController'

const router = Router()

router.post('/mercadopago', WebhookController.registrar)
router.get('/', WebhookController.listar)
router.get('/:id', WebhookController.buscarPorId)

export default router
