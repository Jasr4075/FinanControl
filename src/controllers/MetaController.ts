import { Request, Response } from 'express'
import { MetaService } from '../services/MetaService'
import { metaCreateSchema, metaUpdateSchema } from '../validators/meta.schema'

export const createMeta = async (req: Request, res: Response) => {
  try {
    const metaValidated = metaCreateSchema.parse(req.body)
    const meta = await MetaService.create(metaValidated)
    res.status(201).json({ success: true, data: meta })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getMetas = async (_req: Request, res: Response) => {
  try {
    const metas = await MetaService.getAll()
    res.status(200).json({ success: true, data: metas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMetaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const meta = await MetaService.getById(id)
    res.status(200).json({ success: true, data: meta })
  } catch (error: any) {
    res.status(error.message === 'Meta não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}

export const updateMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const metaValidated = metaUpdateSchema.parse(req.body)
    const metaAtualizada = await MetaService.update(id, metaValidated)
    res.status(200).json({ success: true, data: metaAtualizada })
  } catch (error: any) {
    const status = error.message === 'Meta não encontrada.' ? 404 : 400
    res.status(status).json({ success: false, message: error.message })
  }
}

export const deleteMeta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resultado = await MetaService.delete(id)
    res.status(200).json({ success: true, message: resultado.message })
  } catch (error: any) {
    res.status(error.message === 'Meta não encontrada.' ? 404 : 500).json({ success: false, message: error.message })
  }
}
