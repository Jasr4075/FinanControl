import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize'
import { sequelize } from '../config/config'

export class Usuario extends Model<
    InferAttributes<Usuario>,
    InferCreationAttributes<Usuario>
> {
    declare id: CreationOptional<string>
    declare nome: string
    declare email: string
    declare telefone: string
    declare username: string
    declare hash: string
    declare role: 'ADMIN' | 'CLIENT'
    declare mp_access_token: string | null
    declare mp_refresh_token: string | null
    declare mp_expires_in: Date | null

}

Usuario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'CLIENT'),
            allowNull: false,
            defaultValue: 'CLIENT',
        },
        mp_access_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mp_refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mp_expires_in: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['email'] },
            { fields: ['username'] },
        ],
        scopes: {
            withHash: {
                attributes: { include: ['hash'] },
            },
        },
    }
)
