import { Model } from 'sequelize'

export class BaseModel<
  TAttributes extends object = any,
  TCreationAttributes extends object = TAttributes
> extends Model<TAttributes, TCreationAttributes> {}
