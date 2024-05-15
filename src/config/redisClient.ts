import Redis from 'ioredis';
import logger from '../utils/logger';

export const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
    retryStrategy: times => Math.min(times * 50, 2000)
});

redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (err) => logger.error('Redis Client Error', err));

