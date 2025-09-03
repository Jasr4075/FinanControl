"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContaController_1 = require("../controllers/ContaController");
const router = (0, express_1.Router)();
router.post('/', ContaController_1.createConta);
router.get('/', ContaController_1.getContas);
// rota específica de usuário deve vir antes da rota genérica :id
router.get('/user/:userId', ContaController_1.getContasByUserId);
router.get('/:id', ContaController_1.getContaById);
router.put('/:id', ContaController_1.updateConta);
router.delete('/:id', ContaController_1.deleteConta);
exports.default = router;
