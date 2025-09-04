import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { UsuarioService } from '../services/UsuarioService';
import { Usuario } from '../models/Usuario';
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

export const loginMercadoPago = async (req: Request, res: Response) => {
  const redirectUri = process.env.MP_REDIRECT_URI!;
  const clientId = process.env.MP_CLIENT_ID!;
  const authUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.json({ url: authUrl });
};

export const callbackMercadoPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ erro: 'Código de autorização não encontrado' });

    const tokenUrl = 'https://api.mercadopago.com/oauth/token';
    const response = await axios.post(tokenUrl, {
      grant_type: 'authorization_code',
      client_id: process.env.MP_CLIENT_ID!,
      client_secret: process.env.MP_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.MP_REDIRECT_URI!,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { access_token, refresh_token, expires_in, user_id } = response.data;

    // Exemplo: pegar usuário autenticado (podes usar JWT para identificar quem está logado)
    const userId = req.user?.id; // se tiver middleware de autenticação
    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    usuario.mp_access_token = access_token;
    usuario.mp_refresh_token = refresh_token;
    usuario.mp_expires_in = new Date(Date.now() + expires_in * 1000);
    await usuario.save();

    res.json({ sucesso: true, usuario });
  } catch (err) {
    next(err);
  }
};