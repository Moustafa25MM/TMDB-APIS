import Redis from 'ioredis';
import logger from '../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST

export const redisClient = new Redis({
    host: REDIS_HOST,
    port: 6379,
    retryStrategy: times => Math.min(times * 50, 2000)
});

redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (err) => logger.error('Redis Client Error', err));

