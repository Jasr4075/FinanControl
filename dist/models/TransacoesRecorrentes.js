"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransacoesRecorrentes = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
const Category_1 = require("./Category");
class TransacoesRecorrentes extends sequelize_1.Model {
}
exports.TransacoesRecorrentes = TransacoesRecorrentes;
TransacoesRecorrentes.init({
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
        field: 'user_id',
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('Despesa', 'Receita'),
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    frequencia: {
        type: sequelize_1.DataTypes.ENUM('diario', 'semanal', 'mensal'),
        allowNull: false,
    },
    dataInicio: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: 'data_inicio',
    },
    dataFinal: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'data_final',
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
        field: 'category_id',
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'TransacoesRecorrentes',
    tableName: 'transacoes_recorrentes',
    timestamps: true,
    underscored: true,
});
TransacoesRecorrentes.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});
Usuario_1.Usuario.hasMany(TransacoesRecorrentes, {
    foreignKey: 'userId',
    as: 'transacoesRecorrentes',
});
TransacoesRecorrentes.belongsTo(Category_1.Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
});
Category_1.Category.hasMany(TransacoesRecorrentes, {
    foreignKey: 'categoryId',
    as: 'transacoesRecorrentes',
});
