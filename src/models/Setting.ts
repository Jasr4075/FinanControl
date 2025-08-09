import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Usuario } from './Usuario'

export class Setting extends Model<
    InferAttributes<Setting>,
    InferCreationAttributes<Setting>
> {
    declare id: CreationOptional<number>
    declare userId: string
    declare chave: string
    declare value: string
}

Setting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'id',
            },
            field: 'userid',
        },
        chave: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Setting',
        tableName: 'settings',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['userid'] },
            { fields: ['chave'] },
            { fields: ['userid', 'chave'], unique: true },
        ],
    }
)

Usuario.hasMany(Setting, { foreignKey: 'userid' })
Setting.belongsTo(Usuario, { foreignKey: 'userid' })