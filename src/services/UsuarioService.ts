import { Usuario } from '../models/Usuario'
import bcrypt from 'bcrypt'

export class UsuarioService {
  // Remove campo hash antes de enviar para o cliente
  static sanitizeUser(usuario: Usuario) {
    const userData = usuario.toJSON() as any
    delete userData.hash
    return userData
  }

  // Cria um usuário com senha criptografada
  static async create(data: {
    nome: string
    email: string
    telefone: string
    username: string
    senha: string
    role?: 'ADMIN' | 'CLIENT'
  }) {
    const { nome, email, telefone, username, senha, role = 'CLIENT' } = data
    const hash = await bcrypt.hash(senha, 10)

    const usuario = await Usuario.create({
      nome,
      email,
      telefone,
      username,
      hash,
      role,
    })

    return this.sanitizeUser(usuario)
  }

  static async findAll() {
    const usuarios = await Usuario.findAll()
    return usuarios.map(this.sanitizeUser)
  }

  static async findById(id: string) {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return null
    return this.sanitizeUser(usuario)
  }

  static async update(
    id: string,
    data: {
      nome?: string
      email?: string
      telefone?: string
      username?: string
      senha?: string
      role?: 'ADMIN' | 'CLIENT'
    }
  ) {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) throw new Error('Usuário não encontrado')

    const updateData: any = { ...data }
    if (data.senha) {
      updateData.hash = await bcrypt.hash(data.senha, 10)
      delete updateData.senha
    }

    await usuario.update(updateData)
    return this.sanitizeUser(usuario)
  }

  static async delete(id: string) {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) throw new Error('Usuário não encontrado')
    await usuario.destroy()
  }
}
