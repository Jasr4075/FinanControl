"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conta = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
class Conta extends sequelize_1.Model {
}
exports.Conta = Conta;
Conta.init({
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
    type: {
        type: sequelize_1.DataTypes.ENUM('Corrente', 'Poupança', 'Efetivo'),
        allowNull: false,
    },
    bancoNome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    agencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    conta: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    saldo: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    efetivo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cdiPercent: {
        type: sequelize_1.DataTypes.DECIMAL(5, 4),
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Conta',
    tableName: 'contas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['type'] },
    ],
});
Conta.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});
Usuario_1.Usuario.hasMany(Conta, {
    foreignKey: 'userId',
    as: 'contas',
});
