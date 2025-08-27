"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meta = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config/config");
const Usuario_1 = require("./Usuario");
const Category_1 = require("./Category");
class Meta extends sequelize_1.Model {
}
exports.Meta = Meta;
Meta.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuarioId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'usuario_id',
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'category_id',
    },
    limitAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'limit_amount',
    },
    month: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 12 },
    },
    year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: config_1.sequelize,
    modelName: 'Meta',
    tableName: 'metas',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['usuario_id'] },
        { fields: ['category_id'] },
        { fields: ['month', 'year'] },
        { unique: true, fields: ['usuario_id', 'category_id', 'month', 'year'] },
    ],
});
Meta.belongsTo(Usuario_1.Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
});
Meta.belongsTo(Category_1.Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
});
