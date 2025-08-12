"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fatura = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Cartao_1 = require("./Cartao");
class Fatura extends sequelize_1.Model {
}
exports.Fatura = Fatura;
Fatura.init({
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
    mes: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12,
        },
    },
    ano: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    valorTotal: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    paga: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    dataPagamento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Fatura',
    tableName: 'faturas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['cartao_id'] },
        { fields: ['mes', 'ano'] },
    ],
});
Cartao_1.Cartao.hasMany(Fatura, {
    foreignKey: 'cartaoId',
    as: 'faturas',
});
Fatura.belongsTo(Cartao_1.Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
});
