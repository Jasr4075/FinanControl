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

export class Cartao extends Model<
    InferAttributes<Cartao>,
    InferCreationAttributes<Cartao>
> {
    declare id: CreationOptional<string>
    declare userId: ForeignKey<string>
    declare contaId: ForeignKey<string>
    declare nome: string
    declare type: 'CREDITO' | 'DEBITO' | 'MISTO'
    declare creditLimit: number
    declare hasCashback: boolean
    declare cashbackPercent: number
    declare closingDay: number
    declare dueDay: number
    declare active: boolean
    declare creditUsed: number
}

Cartao.init(
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
        contaId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'contas',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('CREDITO', 'DEBITO', 'MISTO'),
            allowNull: false,
        },
        creditLimit: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        creditUsed: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'credit_used'
        },
        hasCashback: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        cashbackPercent: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        closingDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dueDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Cartao',
        tableName: 'cartoes',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['conta_id'] },
            { fields: ['type'] },
            // Opcional: evitar nomes duplicados por usuário
            { unique: false, fields: ['user_id', 'nome'] },
        ],
    }
)

Usuario.hasMany(Cartao, {
    foreignKey: 'userId',
    as: 'cartoes',
})

Cartao.belongsTo(Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
})

Conta.hasMany(Cartao, {
    foreignKey: 'contaId',
    as: 'cartoes',
})

Cartao.belongsTo(Conta, {
    foreignKey: 'contaId',
    as: 'conta',
})
