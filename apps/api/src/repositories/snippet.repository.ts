import { Redis } from "@upstash/redis";
import { REDIS_KEYS, SNIPPET_LIMITS, SnippetRedisEntity } from "@pastebin/shared";
import { ISnippetRepository } from "./interfaces/snippet.repository.interface.js";

export class SnippetRepository implements ISnippetRepository {
	constructor(private readonly redisClient: Redis) { }

	private getSnippetKey(id: string): string {
		return `${REDIS_KEYS.SNIPPET_PREFIX}${id}`;
	}

	async save(snippet: SnippetRedisEntity, ttlSeconds: number): Promise<void> {
		const key = this.getSnippetKey(snippet.id);
		const serialized = JSON.stringify(snippet);

		const effectiveTtl =
			ttlSeconds === 0
				? SNIPPET_LIMITS.BURN_FALLBACK_TTL_SECONDS
				: Math.max(1, ttlSeconds);

		await this.redisClient.set(key, serialized, { ex: effectiveTtl });
	}

	async findById(id: string): Promise<SnippetRedisEntity | null> {
		const key = this.getSnippetKey(id);
		const raw = await this.redisClient.get<string | SnippetRedisEntity>(key);

		if (!raw) {
			return null;
		}

		if (typeof raw === "string") {
			try {
				return JSON.parse(raw) as SnippetRedisEntity;
			} catch (error) {
				console.error(`[SnippetRepository] Malformed JSON payload for key ${key}:`, error);
				return null;
			}
		}

		return raw as SnippetRedisEntity;
	}

	async update(snippet: SnippetRedisEntity): Promise<void> {
		const key = this.getSnippetKey(snippet.id);
		const currentTtl = await this.redisClient.ttl(key);

		if (currentTtl <= 0) {
			return;
		}

		const serialized = JSON.stringify(snippet);
		await this.redisClient.set(key, serialized, { ex: currentTtl });
	}

	async delete(id: string): Promise<boolean> {
		const key = this.getSnippetKey(id);
		const deletedCount = await this.redisClient.del(key);
		return deletedCount > 0;
	}

	async incrementViewCount(id: string): Promise<number> {
		const snippet = await this.findById(id);
		if (!snippet) {
			return 0;
		}

		snippet.viewCount += 1;
		await this.update(snippet);
		return snippet.viewCount;
	}

	async getTtl(id: string): Promise<number> {
		const key = this.getSnippetKey(id);
		return await this.redisClient.ttl(key);
	}
}