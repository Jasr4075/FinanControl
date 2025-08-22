"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcela = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Despesa_1 = require("./Despesa");
const Cartao_1 = require("./Cartao");
const Fatura_1 = require("./Fatura");
class Parcela extends sequelize_1.Model {
}
exports.Parcela = Parcela;
Parcela.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    despesaId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'despesas',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    numeroParcela: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    valor: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    dataVencimento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    faturaId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: Fatura_1.Fatura,
            key: 'id',
        },
        field: 'fatura_id',
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
    modelName: 'Parcela',
    tableName: 'parcelas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['despesa_id'] },
        { fields: ['cartao_id'] },
        { fields: ['fatura_id'] },
        { fields: ['paga'] },
    ],
});
Despesa_1.Despesa.hasMany(Parcela, {
    foreignKey: 'despesaId',
    as: 'parcelas',
});
Parcela.belongsTo(Despesa_1.Despesa, {
    foreignKey: 'despesaId',
    as: 'despesa',
});
Cartao_1.Cartao.hasMany(Parcela, {
    foreignKey: 'cartaoId',
    as: 'parcelas',
});
Parcela.belongsTo(Cartao_1.Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
});
Fatura_1.Fatura.hasMany(Parcela, {
    foreignKey: 'faturaId',
    as: 'parcelas',
});
Parcela.belongsTo(Fatura_1.Fatura, {
    foreignKey: 'faturaId',
    as: 'fatura',
});
