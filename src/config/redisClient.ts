import Redis from 'ioredis';

export const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
    retryStrategy: times => Math.min(times * 50, 2000)
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));

