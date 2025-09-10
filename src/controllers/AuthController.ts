import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/UsuarioService';
import { TokenService } from '../services/TokenService';
import bcrypt from 'bcrypt';
import { usuarioCreateSchema } from '../validators/usuario.schema';
import { z } from 'zod';
import { getUserCached } from "../helpers/redisCache";


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
    const loginSchema = z.object({
      username: z.string().min(1, "Username é obrigatório"),
      senha: z.string().min(1, "Senha é obrigatória"),
    });

    const { username, senha } = loginSchema.parse(req.body);

    // 🔥 Busca o usuário no Redis antes de ir ao Postgres
    const usuario = await getUserCached(username);
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos." });
    }

    // Valida senha
    const senhaValida = await bcrypt.compare(senha, usuario.hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos." });
    }

    // Gera tokens
    const token = TokenService.gerarToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role,
    });
    const refreshToken = await TokenService.gerarRefreshToken(usuario.id);

    res.json({
      token,
      refreshToken: refreshToken.token,
      user: UsuarioService.sanitizeUser(usuario),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ erros: err.errors });
    }
    next(err);
  }
};