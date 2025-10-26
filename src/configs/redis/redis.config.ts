import configuration from '@configs/configuration';
import { TimeDurationInSeconds } from '@configs/constants/constants';
import { createClient } from 'redis';

export const redisClient = createClient({
  socket: {
    host: configuration().REDIS_HOST,
    port: configuration().REDIS_PORT,
  },
  password: configuration().REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function connectToRedisClient() {
  try {
    await redisClient.connect();
  } catch (error: any) {
    console.log(error.message);
    return;
  }
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached.toString()) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setToCache<T>(
  key: string,
  value: T,
  ttl?: number,
): Promise<void> {
  try {
    const options = ttl ? { EX: ttl } : { EX: TimeDurationInSeconds.OneDay };
    await redisClient.set(key, JSON.stringify(value), options);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}
