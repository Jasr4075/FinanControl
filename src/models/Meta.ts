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
  import { Category } from './Category'
  
  export class Meta extends Model<
    InferAttributes<Meta>,
    InferCreationAttributes<Meta>
  > {
    declare id: CreationOptional<string>
    declare usuarioId: ForeignKey<string>
    declare categoryId: ForeignKey<string>
    declare limitAmount: number
    declare month: number
    declare year: number
  }
  
  Meta.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      usuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'usuario_id',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'category_id',
      },
      limitAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'limit_amount',
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 12 },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Meta',
      tableName: 'metas',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['usuario_id'] },
        { fields: ['category_id'] },
        { fields: ['month', 'year'] },
  { unique: true, fields: ['usuario_id', 'category_id', 'month', 'year'] },
      ],
    }
  )
  
  Meta.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
  })
  
  Meta.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
  })
  
  