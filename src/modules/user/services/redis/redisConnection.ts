import { createClient } from 'redis';

import { config } from '../../../../shared/config';

const port = config.auth.redisServerPort;
const host = config.auth.redisServerHost;
const password = config.auth.redisPassword;

const redisConnection = config.environment.isDevelopment 
  ? createClient()
  : createClient({
      password,
      socket: {
          host,
          port
      }
    });

redisConnection.on('error', error => console.error('Redis client error:', error));

redisConnection.connect();

redisConnection.on("connect", () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
