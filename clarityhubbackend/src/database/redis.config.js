import Redis from "ioredis";
import RedisMock from "ioredis-mock";
import { env } from "../config/env.config.js";

const useMockRedis = env.NODE_ENV === "test" || !env.UPSTASH_REDIS_URL;

export const redis = useMockRedis
  ? new RedisMock()
  : new Redis(env.UPSTASH_REDIS_URL, {
      tls: {},
      maxRetriesPerRequest: null,
      reconnectOnError: (err) => {
        console.error("Redis reconnect error:", err.message);
        return true;
      },
      retryStrategy: (times) => Math.min(times * 500, 5000),
    });

if (useMockRedis) {
  console.log("[redis] Using in-memory Redis mock");
} else {
  redis.on("connect", () => {
    console.log("Connected to Upstash Redis");
  });

  redis.on("error", (err) => {
    console.error("Redis Error:", err.message);
  });

  redis.on("close", () => {
    console.warn("Redis connection closed, retrying...");
  });
}
