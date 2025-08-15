import jwt, { SignOptions } from 'jsonwebtoken';
const secret = process.env.JWT_SECRET as string;

export class TokenService {
  static gerarToken(payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN || '1h'): string {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
  }

  static verificarToken(token: string): any | null {
    try {
      return jwt.verify(token, secret);
    } catch (err: any) {
      console.error('Token inválido o expirado:', err.message);
      return null;
    }
  }
}
