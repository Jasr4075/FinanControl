import { Request, Response } from 'express'
import { UsuarioService } from '../services/UsuarioService'

export const createUsuario = async (req: Request, res: Response) => {
  const { nome, email, telefone, username, senha, role } = req.body

  try {
    if (!nome || !email || !telefone || !username || !senha) {
      return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos.' })
    }

    const usuario = await UsuarioService.create({ nome, email, telefone, username, senha, role })

    res.status(201).json({ success: true, data: usuario })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioService.findAll()
    res.status(200).json({ success: true, data: usuarios })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const usuario = await UsuarioService.findById(id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' })
    }
    res.status(200).json({ success: true, data: usuario })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateUsuario = async (req: Request, res: Response) => {
  const { id } = req.params
  const { nome, email, telefone, username, senha, role } = req.body

  try {
    const usuario = await UsuarioService.update(id, { nome, email, telefone, username, senha, role })
    res.status(200).json({ success: true, data: usuario })
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await UsuarioService.delete(id)
    res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' })
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
