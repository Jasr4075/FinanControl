"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transferencia = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Conta_1 = require("./Conta");
class Transferencia extends sequelize_1.Model {
}
exports.Transferencia = Transferencia;
Transferencia.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    fromAccountId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'contas',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'from_account_id',
    },
    toAccountId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'contas',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'to_account_id',
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Transferencia',
    tableName: 'transferencias',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['from_account_id'] },
        { fields: ['to_account_id'] },
        { fields: ['date'] },
    ],
});
Transferencia.belongsTo(Conta_1.Conta, {
    foreignKey: 'fromAccountId',
    as: 'contaOrigem',
});
Transferencia.belongsTo(Conta_1.Conta, {
    foreignKey: 'toAccountId',
    as: 'contaDestino',
});
