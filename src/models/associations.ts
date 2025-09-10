// src/models/associations.ts
import { Conta } from './Conta';
import { Cartao } from './Cartao';
import { Usuario } from './Usuario';

// Conta <> Cartao
Conta.hasMany(Cartao, { foreignKey: 'contaId', as: 'cartoes' });
Cartao.belongsTo(Conta, { foreignKey: 'contaId', as: 'conta' });

// Conta <> Usuario
Usuario.hasMany(Conta, { foreignKey: 'userId', as: 'contas' });
Conta.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

// Cartao <> Usuario
Cartao.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
Usuario.hasMany(Cartao, { foreignKey: 'userId', as: 'cartoes' });
