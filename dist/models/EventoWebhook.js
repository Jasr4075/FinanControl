"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoWebhook = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
class EventoWebhook extends sequelize_1.Model {
    getParsedPayload() {
        return JSON.parse(this.payload);
    }
}
exports.EventoWebhook = EventoWebhook;
EventoWebhook.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    tipo_evento: {
        type: sequelize_1.DataTypes.ENUM('payment.created', 'payment.updated', 'merchant_order.updated'),
        allowNull: false,
    },
    mercado_pago_event_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    payload: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    recebido_em: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    verificado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'EventoWebhook',
    tableName: 'eventos_webhook',
    timestamps: false,
});
