"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebhookController_1 = require("../controllers/WebhookController");
const router = (0, express_1.Router)();
router.post('/mercadopago', WebhookController_1.WebhookController.registrar);
router.get('/', WebhookController_1.WebhookController.listar);
router.get('/:id', WebhookController_1.WebhookController.buscarPorId);
exports.default = router;
