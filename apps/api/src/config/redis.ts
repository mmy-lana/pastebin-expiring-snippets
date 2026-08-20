import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured =
	Boolean(redisUrl && redisToken) &&
	!redisUrl?.includes("localhost") &&
	!redisUrl?.includes("127.0.0.1") &&
	!redisUrl?.includes("example_token");

// In-memory fallback adapter for offline local development
class InMemoryRedisAdapter {
	private store = new Map<string, { value: string; expiresAt: number | null }>();

	async set(key: string, value: unknown, opts?: { ex?: number }): Promise<string> {
		const expiresAt = opts?.ex ? Date.now() + opts.ex * 1000 : null;
		this.store.set(key, {
			value: typeof value === "string" ? value : JSON.stringify(value),
			expiresAt
		});
		return "OK";
	}

	async get<T = string>(key: string): Promise<T | null> {
		const item = this.store.get(key);
		if (!item) return null;
		if (item.expiresAt && Date.now() > item.expiresAt) {
			this.store.delete(key);
			return null;
		}
		try {
			return JSON.parse(item.value) as T;
		} catch {
			return item.value as unknown as T;
		}
	}

	async del(key: string): Promise<number> {
		return this.store.delete(key) ? 1 : 0;
	}

	async ttl(key: string): Promise<number> {
		const item = this.store.get(key);
		if (!item || !item.expiresAt) return -1;
		const remaining = Math.floor((item.expiresAt - Date.now()) / 1000);
		return remaining > 0 ? remaining : -2;
	}

	async incr(key: string): Promise<number> {
		const item = this.store.get(key);
		const count = item ? parseInt(item.value, 10) + 1 : 1;
		this.store.set(key, { value: String(count), expiresAt: item?.expiresAt || null });
		return count;
	}

	async expire(key: string, seconds: number): Promise<number> {
		const item = this.store.get(key);
		if (!item) return 0;
		item.expiresAt = Date.now() + seconds * 1000;
		return 1;
	}

	async ping(): Promise<string> {
		return "PONG";
	}
}

export const redis: Redis = isConfigured
	? new Redis({ url: redisUrl!, token: redisToken! })
	: (new InMemoryRedisAdapter() as unknown as Redis);

export async function verifyRedisConnection(): Promise<boolean> {
	try {
		const pong = await redis.ping();
		return pong === "PONG" || pong === "pong" || pong === "OK" || pong === "ok";
	} catch (error) {
		console.error("[RedisConfig] Failed to connect to Redis instance:", error);
		return false;
	}
}