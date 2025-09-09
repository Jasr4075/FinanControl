import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL as string;

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error("Redis ❌", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis    ✅");
  } catch (err) {
    console.error("Erro ao conectar no Redis", err);
  }
})();
