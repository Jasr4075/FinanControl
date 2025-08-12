"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receita = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
const Conta_1 = require("./Conta");
const Category_1 = require("./Category");
class Receita extends sequelize_1.Model {
}
exports.Receita = Receita;
Receita.init({
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
        field: 'user_id',
    },
    accountId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'contas',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'account_id',
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
        field: 'category_id',
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    quantidade: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    data: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    nota: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Receita',
    tableName: 'receitas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['account_id'] },
        { fields: ['category_id'] },
        { fields: ['data'] },
    ],
});
Receita.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});
Receita.belongsTo(Conta_1.Conta, {
    foreignKey: 'accountId',
    as: 'contas',
});
Receita.belongsTo(Category_1.Category, {
    foreignKey: 'categoryId',
    as: 'categories',
});
