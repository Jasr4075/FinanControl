"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cashback = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Cartao_1 = require("./Cartao");
const Despesa_1 = require("./Despesa");
class Cashback extends sequelize_1.Model {
}
exports.Cashback = Cashback;
Cashback.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    cartaoId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'cartoes',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    quantidade: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    despesaId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'despesas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    creditDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    appliedTo: {
        type: sequelize_1.DataTypes.ENUM('FATURA', 'CONTA'),
        allowNull: false,
        defaultValue: 'FATURA',
        field: 'applied_to'
    },
    applied: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Cashback',
    tableName: 'cashbacks',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['cartao_id'] },
        { unique: false, fields: ['despesa_id'] },
    ],
});
Despesa_1.Despesa.hasMany(Cashback, {
    foreignKey: 'despesaId',
    as: 'despesa',
});
Cashback.belongsTo(Despesa_1.Despesa, {
    foreignKey: 'despesaId',
    as: 'despesa',
});
Cartao_1.Cartao.hasMany(Cashback, {
    foreignKey: 'cartaoId',
    as: 'cartao',
});
Cashback.belongsTo(Cartao_1.Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
});
