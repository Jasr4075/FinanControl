import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import { sequelize } from '../config/config';
import { Usuario } from './Usuario';
import { Category } from './Category';
  
  export class TransacoesRecorrentes extends Model<
    InferAttributes<TransacoesRecorrentes>,
    InferCreationAttributes<TransacoesRecorrentes>
  > {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare type: 'Despesa' | 'Receita';
    declare amount: number;
    declare descricao: string;
    declare frequencia: 'diario' | 'semanal' | 'mensal';
    declare dataInicio: Date;
    declare dataFinal: Date | null;
    declare categoryId: string;
    declare active: boolean;
  }
  
  TransacoesRecorrentes.init(
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
        field: 'user_id',
      },
      type: {
        type: DataTypes.ENUM('Despesa', 'Receita'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequencia: {
        type: DataTypes.ENUM('diario', 'semanal', 'mensal'),
        allowNull: false,
      },
      dataInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'data_inicio',
      },
      dataFinal: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'data_final',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        field: 'category_id',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'TransacoesRecorrentes',
      tableName: 'transacoes_recorrentes',
      timestamps: true,
      underscored: true,
    }
  );
  
TransacoesRecorrentes.belongsTo(Usuario, {
    foreignKey: 'userId',
    as: 'usuario',
});

Usuario.hasMany(TransacoesRecorrentes, {
    foreignKey: 'userId',
    as: 'transacoesRecorrentes',
});

TransacoesRecorrentes.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'categoria',
});

Category.hasMany(TransacoesRecorrentes, {
    foreignKey: 'categoryId',
    as: 'transacoesRecorrentes',
});