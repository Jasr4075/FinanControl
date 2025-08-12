"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
class Setting extends sequelize_1.Model {
}
exports.Setting = Setting;
Setting.init({
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
    chave: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Setting',
    tableName: 'settings',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['userid'] },
        { fields: ['chave'] },
        { fields: ['userid', 'chave'], unique: true },
    ],
});
Usuario_1.Usuario.hasMany(Setting, { foreignKey: 'userid' });
Setting.belongsTo(Usuario_1.Usuario, { foreignKey: 'userid' });
