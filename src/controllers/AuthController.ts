import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/UsuarioService';
import { TokenService } from '../services/TokenService';
import bcrypt from 'bcrypt';
import { usuarioCreateSchema } from '../validators/usuario.schema';
import { z } from 'zod';

// --- Cadastro ---
export const registerUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Valida com Zod
    const parsedData = usuarioCreateSchema.parse(req.body);

    const usuario = await UsuarioService.create(parsedData);
    const token = TokenService.gerarToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role,
    });
    const refreshToken = await TokenService.gerarRefreshToken(usuario.id);

    res.status(201).json({ user: usuario, token, refreshToken: refreshToken.token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ erros: err.errors });
    }
    next(err);
  }
};

// --- Login ---
export const loginUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validação simples para login
    const loginSchema = z.object({
      username: z.string().min(1, "Username é obrigatório"),
      senha: z.string().min(1, "Senha é obrigatória"),
    });

    const { username, senha } = loginSchema.parse(req.body);

    const usuario = await UsuarioService.findByUsernameRaw(username);
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    const token = TokenService.gerarToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role,
    });
    const refreshToken = await TokenService.gerarRefreshToken(usuario.id);

    res.json({ token, refreshToken: refreshToken.token, user: UsuarioService.sanitizeUser(usuario) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ erros: err.errors });
    }
    next(err);
  }
};
