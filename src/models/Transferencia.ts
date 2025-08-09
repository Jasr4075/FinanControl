import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
  } from 'sequelize'
  import { sequelize } from '../config/config'
  import { Conta } from './Conta'
  
  export class Transferencia extends Model<
    InferAttributes<Transferencia>,
    InferCreationAttributes<Transferencia>
  > {
    declare id: CreationOptional<string>
    declare fromAccountId: ForeignKey<string>
    declare toAccountId: ForeignKey<string>
    declare amount: number
    declare date: Date
    declare description?: string
  }
  
  Transferencia.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fromAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'contas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'from_account_id',
      },
      toAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'contas',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'to_account_id',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Transferencia',
      tableName: 'transferencias',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['from_account_id'] },
        { fields: ['to_account_id'] },
        { fields: ['date'] },
      ],
    }
  )
  
  Transferencia.belongsTo(Conta, {
    foreignKey: 'fromAccountId',
    as: 'contaOrigem',
  })
  
  Transferencia.belongsTo(Conta, {
    foreignKey: 'toAccountId',
    as: 'contaDestino',
  })
  