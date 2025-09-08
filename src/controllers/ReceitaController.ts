import { Request, Response } from 'express'
import { ReceitaService } from '../services/ReceitaService'
import { receitaCreateSchema, receitaUpdateSchema } from '../validators/receita.schema'
import z from 'zod'

export const createReceita = async (req: Request, res: Response) => {
  try {
    // Valida os dados de entrada com o schema
    const validatedData = receitaCreateSchema.parse(req.body)

    const novaReceita = await ReceitaService.create(validatedData)

    res.status(201).json({ success: true, data: novaReceita })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Se for um erro de validação do Zod, retorna os erros de forma mais detalhada
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getReceitas = async (req: Request, res: Response) => {
  try {
    const receitas = await ReceitaService.findAll()
    res.status(200).json({ success: true, data: receitas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getReceitaById = async (req: Request, res: Response) => {
  try {
    const receita = await ReceitaService.findById(req.params.id)
    if (!receita) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, data: receita })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateReceita = async (req: Request, res: Response) => {
  try {
    // Valida os dados de atualização com o schema
    const validatedData = receitaUpdateSchema.parse(req.body)
    const updateData = {
      ...validatedData,
      nota: validatedData.nota ?? undefined
    }

    const receitaAtualizada = await ReceitaService.update(req.params.id, updateData)
    if (!receitaAtualizada) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, data: receitaAtualizada })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteReceita = async (req: Request, res: Response) => {
  try {
    const deletada = await ReceitaService.delete(req.params.id)
    if (!deletada) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada.' })
    }
    res.status(200).json({ success: true, message: 'Receita excluída com sucesso.' })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTotalReceitasMes = async (req: Request, res: Response) => {
  try {
    const { ano, mes } = req.query
    let total: number
    if (ano && mes) {
      const anoNum = Number(ano)
      const mesNum = Number(mes)
      if (!anoNum || !mesNum || mesNum < 1 || mesNum > 12) {
        return res.status(400).json({ success: false, message: 'Parâmetros ano/mes inválidos.' })
      }
      total = await ReceitaService.getTotalByMonth(req.params.userId, anoNum, mesNum)
    } else {
      total = await ReceitaService.getTotalMes(req.params.userId)
    }
    res.status(200).json({ success: true, total })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getUltimasReceitas = async (req: Request, res: Response) => {
  try {
    const receitas = await ReceitaService.getUltimas(req.params.userId, 15)
    res.status(200).json({ success: true, data: receitas })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getReceitasMesAtual = async (req: Request, res: Response) => {
  try {
    const receitas = await ReceitaService.getMesAtual(req.params.userId);
    res.status(200).json({ success: true, data: receitas });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
