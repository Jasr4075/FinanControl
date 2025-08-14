import { z } from 'zod';

export const usuarioCreateSchema = z.object({
    nome: z.string()
        .min(1, 'Nome é obrigatório')
        .transform(nome => nome.trim()),

    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
        .transform((email) => email.trim()),

    telefone: z.string()
        .min(8, 'Telefone inválido')
        .transform(telefone => telefone.trim()),

    username: z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .transform(username => username.trim()),

    senha: z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .transform(senha => senha.trim()),

    role: z.union([z.literal('ADMIN'), z.literal('CLIENT')], {
        message: 'Role inválido',
    })
});

export type UsuarioCreateDTO = z.infer<typeof usuarioCreateSchema>;

export const usuarioUpdateSchema = z.object({
    nome: z.string()
        .min(1, 'Nome não pode ser vazio')
        .optional()
        .transform(nome => nome?.trim()),

    email: z.string()
        .min(1, 'Email é obrigatório')
        .email('Formato de email inválido')
        .transform(email => email.trim()),

    telefone: z.string()
        .min(8, 'Telefone inválido')
        .optional()
        .transform(telefone => telefone?.trim()),

    username: z.string()
        .min(3, 'Username deve ter pelo menos 3 caracteres')
        .optional()
        .transform(username => username?.trim()),

    senha: z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .optional()
        .transform(senha => senha?.trim()),

    role: z.union([z.literal('ADMIN'), z.literal('CLIENT')], {
        message: 'Role inválido',
    }).optional()
});

export type UsuarioUpdateDTO = z.infer<typeof usuarioUpdateSchema>;
