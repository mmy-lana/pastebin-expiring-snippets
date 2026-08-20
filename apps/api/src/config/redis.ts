import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
	console.warn(
		"[RedisConfig] Warning: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing in environment variables."
	);
}

export const redis = new Redis({
	url: redisUrl || "",
	token: redisToken || ""
});

export async function verifyRedisConnection(): Promise<boolean> {
	try {
		const pong = await redis.ping();
		return pong === "PONG" || pong === "pong" || pong === "OK" || pong === "ok";
	} catch (error) {
		console.error("[RedisConfig] Failed to connect to Redis instance:", error);
		return false;
	}
}