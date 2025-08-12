"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacao = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
class Notificacao extends sequelize_1.Model {
}
exports.Notificacao = Notificacao;
Notificacao.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Usuario_1.Usuario,
            key: 'id',
        },
        field: 'userid',
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Notificacao',
    tableName: 'notificacoes',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['userid'] },
        { fields: ['read'] },
    ],
});
Usuario_1.Usuario.hasMany(Notificacao, {
    foreignKey: 'userid'
});
Notificacao.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'userid'
});
