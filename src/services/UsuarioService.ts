import { Usuario } from '../models/Usuario';
import { Conta } from '../models/Conta';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/config';
import { AppError } from '../middlewares/errorHandler';

export class UsuarioService {
  // Remove campo hash antes de enviar para o cliente
  static sanitizeUser(usuario: Usuario) {
    const userData = usuario.toJSON() as any;
    delete userData.hash;
    return userData;
  }

  // Cria um usuário com senha criptografada
  static async create(data: {
    nome: string;
    email: string;
    telefone: string;
    username: string;
    senha: string;
    role?: 'ADMIN' | 'CLIENT';
  }) {
    const { nome, email, telefone, username, senha, role = 'CLIENT' } = data;
    const hash = await bcrypt.hash(senha, 10);

    return await sequelize.transaction(async (t) => {
      // 1️⃣ Cria o usuário
      const usuario = await Usuario.create(
        {
          nome,
          email,
          telefone,
          username,
          hash,
          role,
        },
        { transaction: t }
      );

      // 2️⃣ Cria a conta EFETIVO
      await Conta.create(
        {
          userId: usuario.id,
          type: 'EFETIVO',
          bancoNome: 'Dinheiro em espécie',
          agencia: '0001',
          conta: '000000-0',
          saldo: 0,
          efetivo: true,
          cdiPercent: 0,
        },
        { transaction: t }
      );

      return this.sanitizeUser(usuario);
    });
  }

  static async findAll() {
    const usuarios = await Usuario.findAll();
    return usuarios.map(this.sanitizeUser);
  }

  static async findById(id: string) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);
    return this.sanitizeUser(usuario);
  }

  static async update(
    id: string,
    data: {
      nome?: string;
      email?: string;
      telefone?: string;
      username?: string;
      senha?: string;
      role?: 'ADMIN' | 'CLIENT';
    }
  ) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);

    const updateData: any = { ...data };
    if (data.senha) {
      updateData.hash = await bcrypt.hash(data.senha, 10);
      delete updateData.senha;
    }

    await usuario.update(updateData);
    return this.sanitizeUser(usuario);
  }

  static async delete(id: string) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new AppError('Usuário não encontrado.', 404);
    await usuario.destroy();
  }

  static async findByUsername(username: string) {
    const usuario = await Usuario.findOne({ where: { username } });
    return usuario ? this.sanitizeUser(usuario) : null;
  }

  static async findByUsernameRaw(username: string) {
    return await Usuario.scope('withHash').findOne({ where: { username } });
  }
}
