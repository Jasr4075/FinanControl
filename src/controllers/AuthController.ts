import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/UsuarioService';
import { TokenService } from '../services/TokenService';
import bcrypt from 'bcrypt';

export const loginUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, senha } = req.body;
    const usuario = await UsuarioService.findByUsernameRaw(username);

    if (!usuario) return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });

    const senhaValida = await bcrypt.compare(senha, usuario.hash);
    if (!senhaValida) return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });

    const token = TokenService.gerarToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role,
    });

    res.json({ token, user: UsuarioService.sanitizeUser(usuario) });
  } catch (err) {
    next(err);
  }
};
