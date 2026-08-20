import { SnippetRedisEntity } from "@pastebin/shared";

export interface ISnippetRepository {
	save(snippet: SnippetRedisEntity, ttlSeconds: number): Promise<void>;
	findById(id: string): Promise<SnippetRedisEntity | null>;
	update(snippet: SnippetRedisEntity): Promise<void>;
	delete(id: string): Promise<boolean>;
	incrementViewCount(id: string): Promise<number>;
	getTtl(id: string): Promise<number>;
}