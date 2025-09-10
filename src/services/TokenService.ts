import jwt, { SignOptions } from 'jsonwebtoken';
import { RefreshToken } from '../models/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../redisClient';

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

  // Agora gera refresh token em Redis
  static async gerarRefreshToken(userId: string, expiresInDays = 7): Promise<{ token: string }> {
    const token = uuidv4() + "." + uuidv4();
    const ttl = expiresInDays * 24 * 60 * 60; // segundos
    await redisClient.set(`refresh:${token}`, userId, { EX: ttl });
    return { token };
  }

  // Valida e retorna o refresh token se válido
  static async validarRefreshToken(token: string): Promise<{ userId: string } | null> {
    const userId = await redisClient.get(`refresh:${token}`);
    if (!userId) return null;
    return userId ? { userId } : null;
  }

  // Revoga (deleta) o refresh token
  static async revogarRefreshToken(token: string) {
    await redisClient.del(`refresh:${token}`);
  }
}
