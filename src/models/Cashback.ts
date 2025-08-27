import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Cartao } from './Cartao'
import { Despesa } from './Despesa'

export class Cashback extends Model<
    InferAttributes<Cashback>,
    InferCreationAttributes<Cashback>
> {
    declare id: CreationOptional<string>
    declare cartaoId: string
    declare quantidade: number
    declare description: string
    declare despesaId: string
    declare creditDate: Date
    declare appliedTo: 'FATURA' | 'CONTA'
    declare applied: boolean
}

Cashback.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        cartaoId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'cartoes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        quantidade: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        despesaId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'despesas',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        creditDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        appliedTo: {
            type: DataTypes.ENUM('FATURA', 'CONTA'),
            allowNull: false,
            defaultValue: 'FATURA',
            field: 'applied_to'
        },
        applied: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'Cashback',
        tableName: 'cashbacks',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['cartao_id'] },
            { unique: false, fields: ['despesa_id'] },
        ],
    }
)

Despesa.hasMany(Cashback, {
    foreignKey: 'despesaId',
    as: 'despesa',
})

Cashback.belongsTo(Despesa, {
    foreignKey: 'despesaId',
    as: 'despesa',
})

Cartao.hasMany(Cashback, {
    foreignKey: 'cartaoId',
    as: 'cartao',
})

Cashback.belongsTo(Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
})