"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PagamentoController_1 = require("../controllers/PagamentoController");
const router = (0, express_1.Router)();
router.get('/', PagamentoController_1.PagamentoController.listar);
router.get('/:id', PagamentoController_1.PagamentoController.buscarPorId);
exports.default = router;
