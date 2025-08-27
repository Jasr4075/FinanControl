import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Cartao } from './Cartao'

export class Fatura extends Model<
    InferAttributes<Fatura>,
    InferCreationAttributes<Fatura>
> {
    declare id: CreationOptional<string>
    declare cartaoId: ForeignKey<string>
    declare mes: number
    declare ano: number
    declare valorTotal: number
    declare valorPago: number
    declare paga: boolean
    declare dataPagamento: Date | null
}

Fatura.init(
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
        mes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12,
            },
        },
        ano: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        valorTotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        valorPago: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'valor_pago'
        },
        paga: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        dataPagamento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Fatura',
        tableName: 'faturas',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['cartao_id'] },
            { fields: ['mes', 'ano'] },
            { unique: true, fields: ['cartao_id', 'mes', 'ano'] },
        ],
    }
)

Cartao.hasMany(Fatura, {
    foreignKey: 'cartaoId',
    as: 'faturas',
})

Fatura.belongsTo(Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
})
