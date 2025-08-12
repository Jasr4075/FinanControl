"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cartao = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
const Conta_1 = require("./Conta");
class Cartao extends sequelize_1.Model {
}
exports.Cartao = Cartao;
Cartao.init({
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
    contaId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'contas',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('CREDITO', 'DEBITO', 'MISTO'),
        allowNull: false,
    },
    creditLimit: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    hasCashback: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cashbackPercent: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
    closingDay: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    dueDay: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Cartao',
    tableName: 'cartoes',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['conta_id'] },
        { fields: ['type'] },
    ],
});
Usuario_1.Usuario.hasMany(Cartao, {
    foreignKey: 'userId',
    as: 'cartoes',
});
Cartao.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});
Conta_1.Conta.hasMany(Cartao, {
    foreignKey: 'contaId',
    as: 'cartoes',
});
Cartao.belongsTo(Conta_1.Conta, {
    foreignKey: 'contaId',
    as: 'conta',
});
