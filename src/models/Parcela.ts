import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize'
import { sequelize } from '../config/config'
import { Despesa } from './Despesa'
import { Cartao } from './Cartao'
import { Fatura } from './Fatura'

export class Parcela extends Model<
    InferAttributes<Parcela>,
    InferCreationAttributes<Parcela>
> {
    declare id: CreationOptional<string>
    declare despesaId: ForeignKey<string>
    declare cartaoId: ForeignKey<string>
    declare numeroParcela: number
    declare valor: number
    declare dataVencimento: Date
    declare faturaId: ForeignKey<Fatura['id']> | null
    declare paga: boolean
    declare dataPagamento: Date | null
}

Parcela.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        despesaId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'despesas',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        numeroParcela: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        valor: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        dataVencimento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        faturaId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: Fatura,
                key: 'id',
            },
            field: 'fatura_id',
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
        modelName: 'Parcela',
        tableName: 'parcelas',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['despesa_id'] },
            { fields: ['cartao_id'] },
            { fields: ['fatura_id'] },
            { fields: ['paga'] },
        ],
    }
)

Despesa.hasMany(Parcela, {
    foreignKey: 'despesaId',
    as: 'parcelas',
})

Parcela.belongsTo(Despesa, {
    foreignKey: 'despesaId',
    as: 'despesa',
})

Cartao.hasMany(Parcela, {
    foreignKey: 'cartaoId',
    as: 'parcelas',
})

Parcela.belongsTo(Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
})

Fatura.hasMany(Parcela, {
    foreignKey: 'faturaId',
    as: 'parcelas',
})

Parcela.belongsTo(Fatura, {
    foreignKey: 'faturaId',
    as: 'fatura',
})
