import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Usuario } from './Usuario'

export class Notificacao extends Model<
    InferAttributes<Notificacao>,
    InferCreationAttributes<Notificacao>
> {
    declare id: CreationOptional<number>
    declare userId: string
    declare type: string
    declare message: string
    declare read: boolean
}

Notificacao.init(
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'Notificacao',
        tableName: 'notificacoes',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['userid'] },
            { fields: ['read'] },
        ],
    }
)

Usuario.hasMany(Notificacao, {
    foreignKey: 'userid'
})
Notificacao.belongsTo(Usuario, {
    foreignKey: 'userid'
})