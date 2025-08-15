import { z } from 'zod'

export const gerarTokenSchema = z.object({
  system: z.string({
    required_error: 'O campo system é obrigatório.',
    invalid_type_error: 'O campo system deve ser uma string.',
  }).nonempty('O campo system não pode ser vazio.'),
})
