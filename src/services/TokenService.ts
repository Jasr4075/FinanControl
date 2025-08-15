import jwt, { SignOptions } from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'supersecret';

export class TokenService {
  static gerarToken(payload: object, expiresIn: string = '1h'): string {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
  }

  static verificarToken(token: string): any | null {
    try {
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  }
}
