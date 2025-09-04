import jwt, { SignOptions } from 'jsonwebtoken';
import { RefreshToken } from '../models/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../models/Usuario';
const secret = process.env.JWT_SECRET || 'supersecret';

export class TokenService {
  static gerarToken(payload: object, expiresIn?: string): string {
    const exp = expiresIn || process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
    return jwt.sign(payload, secret, { expiresIn: exp } as SignOptions);
  }

  static verificarToken(token: string): any | null {
    try {
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  }

  // Gera e salva um refresh token para o usuário (não apaga outros tokens)
  static async gerarRefreshToken(userId: string, expiresInDays = 7): Promise<RefreshToken> {
    const token = uuidv4() + '.' + uuidv4();
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    return await RefreshToken.create({ token, userId, expiresAt });
  }

  // Valida e retorna o refresh token se válido
  static async validarRefreshToken(token: string): Promise<RefreshToken | null> {
    const found = await RefreshToken.findOne({ where: { token } });
    if (!found || found.expiresAt < new Date()) return null;
    return found;
  }

  // Revoga (deleta) o refresh token
  static async revogarRefreshToken(token: string) {
    await RefreshToken.destroy({ where: { token } });
  }
}
