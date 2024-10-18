import { AppConfig } from "./appConfig";


const e = process.env;

const config: AppConfig = {
  api: {
    url: e.API_URL || "",
    port: parseInt(e.PORT || "3000", 10),
    allowedOrigins: [
      "http://localhost:3000",
      "http://localhost:5000",
    ],
  },
  auth: {
    secret: e.APP_SECRET!,
    tokenExpiryTime: 86400, // 24 hours
    redisServerPort: parseInt(e.REDIS_PORT || "6379", 10),
    redisServerHost: e.REDIS_HOST!,
    redisConnectionString: e.REDIS_URL!,
    redisPassword: e.REDIS_PASS,
    karmaUrl: e.KARMA_URL,
    karmaApiKey: e.KARMA_API_KEY
  },

  environment: {
    isProduction: e.NODE_ENV === "production",
    isTesting: e.NODE_ENV === "testing",
    isDevelopment: e.NODE_ENV === "development",
  },
};

export { config };
