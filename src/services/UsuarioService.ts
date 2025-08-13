import { Usuario } from '../models/Usuario'
import bcrypt from 'bcrypt'
import { usuarioCreateSchema, usuarioUpdateSchema, UsuarioCreateDTO, UsuarioUpdateDTO } from '../validators/usuario.schema'

export class UsuarioService {
  static sanitizeUser(usuario: Usuario) {
    const userData = usuario.toJSON() as any
    delete userData.hash
    return userData
  }

  static async create(data: UsuarioCreateDTO) {
    const parsed = usuarioCreateSchema.parse(data)

    const hash = await bcrypt.hash(parsed.senha, 10)

    const usuario = await Usuario.create({
      nome: parsed.nome,
      email: parsed.email,
      telefone: parsed.telefone,
      username: parsed.username,
      hash,
      role: parsed.role ?? 'CLIENT',
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

  static async update(id: string, data: UsuarioUpdateDTO) {
    const parsed = usuarioUpdateSchema.parse(data)

    const usuario = await Usuario.findByPk(id)
    if (!usuario) throw new Error('Usuário não encontrado')

    const updateData: any = { ...parsed }
    if (parsed.senha) {
      updateData.hash = await bcrypt.hash(parsed.senha, 10)
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
