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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentoController = void 0;
const mercadopago_1 = __importDefault(require("../utils/mercadopago"));
class PagamentoController {
    static listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield mercadopago_1.default.payment.search({ options: { limit: 20, offset: 0 } });
                res.json(results.results); // já vem direto
            }
            catch (error) {
                res.status(500).json({ erro: error.message });
            }
        });
    }
    static buscarPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mercadopago_1.default.payment.get({ id: req.params.id });
                res.json(result); // já é o objeto do pagamento
            }
            catch (error) {
                res.status(500).json({ erro: error.message });
            }
        });
    }
}
exports.PagamentoController = PagamentoController;
