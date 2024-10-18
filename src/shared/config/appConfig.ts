interface ApiConfig {
  url: string;
  port: number;
  allowedOrigins: string[];
}

interface AuthConfig {
  secret: string;
  tokenExpiryTime: number;
  redisServerPort: number;
  redisServerHost: string;
  redisConnectionString: string;
  redisPassword: string;
  karmaUrl: string;
  karmaApiKey: string;
}

interface EnvironmentConfig {
  isProduction: boolean;
  isTesting: boolean;
  isDevelopment: boolean;
}

interface AppConfig {
  api: ApiConfig;
  auth: AuthConfig;
  environment: EnvironmentConfig;
}

export { AppConfig };
