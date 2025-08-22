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
import { Conta } from './Conta'
import { Cartao } from './Cartao'
import { Category } from './Category';

export class Despesa extends Model<
    InferAttributes<Despesa>,
    InferCreationAttributes<Despesa>
> {
    declare id: CreationOptional<string>
    declare categoryId: ForeignKey<string>;
    declare userId: ForeignKey<string>
    declare contaId: ForeignKey<string>
    declare cartaoId: ForeignKey<string>
    declare descricao: string
    declare valor: number
    declare metodoPagamento: 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO'
    declare data: Date
    declare parcelado: boolean
    declare numeroParcelas: number
    declare juros: number
    declare observacoes: string
}

Despesa.init(
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
        cartaoId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'cartoes',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        contaId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'contas',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        valor: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        metodoPagamento: {
            type: DataTypes.ENUM('PIX', 'CREDITO', 'DEBITO', 'DINHEIRO'),
            allowNull: false,
        },
        data: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        parcelado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        numeroParcelas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        juros: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'categories',
              key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
    },
    {
        sequelize,
        modelName: 'Despesa',
        tableName: 'despesas',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['conta_id'] },
            { fields: ['cartao_id'] },
            { fields: ['metodo_pagamento'] },
        ],
    }
)

Usuario.hasMany(Despesa, {
    foreignKey: 'userId',
    as: 'despesas',
})

Despesa.belongsTo(Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
})

Conta.hasMany(Despesa, {
    foreignKey: 'contaId',
    as: 'despesas',
})

Despesa.belongsTo(Conta, {
    foreignKey: 'contaId',
    as: 'conta',
})

Cartao.hasMany(Despesa, {
    foreignKey: 'cartaoId',
    as: 'despesas',
})

Despesa.belongsTo(Cartao, {
    foreignKey: 'cartaoId',
    as: 'cartao',
})

Category.hasMany(Despesa, {
    foreignKey: 'categoryId',
    as: 'despesas',
})

Despesa.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
})