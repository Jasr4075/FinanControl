import { Request, Response, NextFunction } from 'express'
import { TokenService } from '../services/TokenService'
import { gerarTokenSchema } from '../validators/auth.schema'
import { z } from 'zod'

type GerarTokenRequestBody = z.infer<typeof gerarTokenSchema>

export async function gerarToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = gerarTokenSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: parsed.error.flatten(),
    })
    return
  }

  const { system } = parsed.data

  if (system !== process.env.SYSTEM_KEY) {
    res.status(403).json({ erro: 'Sistema não autorizado.' })
    return
  }

  try {
    const token = TokenService.gerarToken({ origem: system })
    res.json({ token })
  } catch (error) {
    next(error)
  }
}
