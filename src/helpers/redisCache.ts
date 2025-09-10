import { redisClient } from "../redisClient"
import { UsuarioService } from "../services/UsuarioService";

export async function getUserCached(username: string) {
  const key = `user:${username}`;
  const cached = await redisClient.get(key);

  if (cached) return JSON.parse(cached);

  const user = await UsuarioService.findByUsernameRaw(username);
  if (user) {
    await redisClient.set(key, JSON.stringify(user.get({ plain: true })), { EX: 300 });
  }

  return user;
}
