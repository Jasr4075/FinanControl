import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { UsuarioService } from '../services/UsuarioService';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ erro: "Refresh token é obrigatório." });
    }

    // ✅ Valida refresh token no Redis
    const tokenObj = await TokenService.validarRefreshToken(refreshToken);
    if (!tokenObj) {
      return res.status(401).json({ erro: "Refresh token inválido ou expirado." });
    }

    const usuario = await UsuarioService.findById(tokenObj.userId);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // ♻️ Rotação: revoga o antigo e gera um novo
    await TokenService.revogarRefreshToken(refreshToken);
    const novoRefreshToken = await TokenService.gerarRefreshToken(usuario.id);

    const token = TokenService.gerarToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role,
    });

    res.json({
      token,
      refreshToken: novoRefreshToken.token,
      user: usuario,
    });
  } catch (err) {
    next(err);
  }
};

export const revokeRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ erro: "Refresh token é obrigatório." });
    }

    // ✅ Agora revoga só no Redis
    await TokenService.revogarRefreshToken(refreshToken);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
