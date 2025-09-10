import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Usuario } from './Usuario'
import { Cartao } from './Cartao'

export class Conta extends Model<
    InferAttributes<Conta>,
    InferCreationAttributes<Conta>
> {
    declare id: CreationOptional<string>
    declare userId: ForeignKey<string>
    declare type: 'CORRENTE' | 'POUPANCA' | 'EFETIVO'
    declare bancoNome: string
    declare agencia: string
    declare conta: string
    declare saldo: number
    declare efetivo: boolean
    declare cdiPercent: number
    declare cartoes?: Cartao[]
}

Conta.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        type: {
            type: DataTypes.ENUM('CORRENTE', 'POUPANCA', 'EFETIVO'),
            allowNull: false,
        },
        bancoNome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agencia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        conta: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        saldo: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        efetivo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        cdiPercent: {
            type: DataTypes.DECIMAL(5, 4),
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Conta',
        tableName: 'contas',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['type'] },
        ],
    }
)
