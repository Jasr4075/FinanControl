"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadoPago = void 0;
// @ts-ignore → ignora a falta de tipagem
const mercadopago_1 = require("mercadopago");
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});
exports.mercadoPago = {
    preference: new mercadopago_1.Preference(client),
    payment: new mercadopago_1.Payment(client),
    order: new mercadopago_1.Order(client),
    merchantOrder: new mercadopago_1.MerchantOrder(client),
};
exports.default = exports.mercadoPago;
