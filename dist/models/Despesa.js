"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Despesa = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
const Conta_1 = require("./Conta");
const Cartao_1 = require("./Cartao");
const Category_1 = require("./Category");
class Despesa extends sequelize_1.Model {
}
exports.Despesa = Despesa;
Despesa.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    cartaoId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'cartoes',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    contaId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'contas',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    metodoPagamento: {
        type: sequelize_1.DataTypes.ENUM('PIX', 'Crédito', 'Débito', 'Dinheiro'),
        allowNull: false,
    },
    data: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    parcelado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    numeroParcelas: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    juros: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
    observacoes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Despesa',
    tableName: 'despesas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['conta_id'] },
        { fields: ['cartao_id'] },
        { fields: ['metodo_pagamento'] },
    ],
});
Usuario_1.Usuario.hasMany(Despesa, {
    foreignKey: 'userId',
    as: 'despesas',
});
Despesa.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});
Conta_1.Conta.hasMany(Despesa, {
    foreignKey: 'contaId',
    as: 'despesas',
});
Despesa.belongsTo(Conta_1.Conta, {
    foreignKey: 'contaId',
    as: 'conta',
});
Cartao_1.Cartao.hasMany(Despesa, {
    foreignKey: 'cartaoId',
    as: 'despesas',
});
Despesa.belongsTo(Cartao_1.Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
});
Category_1.Category.hasMany(Despesa, {
    foreignKey: 'categoryId',
    as: 'despesas',
});
Despesa.belongsTo(Category_1.Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
});
