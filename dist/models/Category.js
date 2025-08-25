"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('DESPESA', 'RECEITA', 'META', 'TRANSACAO_RECORRENTE'),
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: config_1.sequelize,
    modelName: 'Category',
    tableName: 'categories',
    updatedAt: false
});
