import jwt, { SignOptions } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string

export class TokenService {
  static gerarToken(payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN || '1h'): string {
    try {
      return jwt.sign(payload, secret, { expiresIn } as SignOptions)
    } catch (err: any) {
      console.error(`[TokenService - gerarToken] Erro ao gerar token: ${err.message}`)
      throw new Error('Erro ao gerar token.')
    }
  }

  static verificarToken(token: string): object | string | null {
    try {
      return jwt.verify(token, secret)
    } catch (err: any) {
      console.error(`[TokenService - verificarToken] Erro ao verificar token: ${err.message}`)
      return null
    }
  }
}
