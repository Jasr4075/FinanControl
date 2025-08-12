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
exports.sequelize = exports.initDatabase = void 0;
const config_1 = require("../config/config");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return config_1.sequelize; } });
require("../models");
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield config_1.sequelize.authenticate();
        console.log('🔌 Conexão com o banco estabelecida com sucesso.');
        // Agora sim: modelos já estão registrados, pode sincronizar
        yield config_1.sequelize.sync({ alter: true });
        console.log('📦 Sincronização com o banco finalizada.');
    }
    catch (error) {
        console.error('❌ Erro ao conectar ou acessar tabela:', error);
    }
});
exports.initDatabase = initDatabase;
