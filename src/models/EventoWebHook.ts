import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize'
  import { sequelize } from '../config/config'
  
  export class EventoWebhook extends Model<
    InferAttributes<EventoWebhook>,
    InferCreationAttributes<EventoWebhook>
  > {
    declare id: CreationOptional<string>
    declare tipo_evento: string
    declare mercado_pago_event_id: string
    declare payload: string
    declare recebido_em: CreationOptional<Date>
    declare verificado: boolean
  
    getParsedPayload() {
      return JSON.parse(this.payload)
    }
  }
  
  EventoWebhook.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tipo_evento: {
        type: DataTypes.ENUM('payment.created', 'payment.updated', 'merchant_order.updated'),
        allowNull: false,
      },
      mercado_pago_event_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      recebido_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      verificado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'EventoWebhook',
      tableName: 'eventos_webhook',
      timestamps: false,
    }
  )