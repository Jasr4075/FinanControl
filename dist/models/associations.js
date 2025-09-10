"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/associations.ts
const Conta_1 = require("./Conta");
const Cartao_1 = require("./Cartao");
const Usuario_1 = require("./Usuario");
// Conta <> Cartao
Conta_1.Conta.hasMany(Cartao_1.Cartao, { foreignKey: 'contaId', as: 'cartoes' });
Cartao_1.Cartao.belongsTo(Conta_1.Conta, { foreignKey: 'contaId', as: 'conta' });
// Conta <> Usuario
Usuario_1.Usuario.hasMany(Conta_1.Conta, { foreignKey: 'userId', as: 'contas' });
Conta_1.Conta.belongsTo(Usuario_1.Usuario, { foreignKey: 'userId', as: 'usuario' });
