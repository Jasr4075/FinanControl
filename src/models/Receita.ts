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
import { Category } from './Category'

export class Receita extends Model<
  InferAttributes<Receita>,
  InferCreationAttributes<Receita>
> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<string>
  declare accountId: ForeignKey<string>
  declare categoryId: ForeignKey<string>
  declare description: string
  declare quantidade: number
  declare data: Date
  declare nota?: string
}

Receita.init(
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
      field: 'user_id',
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contas',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      field: 'account_id',
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
      field: 'category_id',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nota: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Receita',
    tableName: 'receitas',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['account_id'] },
      { fields: ['category_id'] },
      { fields: ['data'] },
    ],
  }
)

Receita.belongsTo(Usuario, {
  foreignKey: 'userId',
  as: 'usuario',
})

Receita.belongsTo(Conta, {
  foreignKey: 'accountId',
  as: 'contas',
})

Receita.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'categories',
})

