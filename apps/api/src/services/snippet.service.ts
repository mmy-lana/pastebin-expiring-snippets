import {
	CreateSnippetInput,
	ExpirationOptions,
	SnippetRedisEntity,
	SnippetResponse,
	UnlockSnippetInput
} from "@pastebin/shared";
import { ISnippetRepository } from "../repositories/interfaces/snippet.repository.interface.js";
import { ISnippetService } from "./interfaces/snippet.service.interface.js";
import { generateSnippetId } from "../utils/id.util.js";
import { hashPassword, verifyPassword } from "../utils/crypto.util.js";
import { AppError } from "../middleware/error.middleware.js";

export class SnippetService implements ISnippetService {
	constructor(private readonly snippetRepository: ISnippetRepository) { }

	async createSnippet(
		input: CreateSnippetInput
	): Promise<{ id: string; expiresAt: number | null }> {
		const id = generateSnippetId();
		const now = Date.now();
		const isBurn = input.ttlSeconds === ExpirationOptions.BURN_AFTER_READ;
		const expiresAt = isBurn ? null : now + input.ttlSeconds * 1000;

		let passwordHash: string | null = null;
		let salt: string | null = null;

		if (input.password && input.password.trim().length > 0) {
			const hashed = hashPassword(input.password);
			passwordHash = hashed.hash;
			salt = hashed.salt;
		}

		const entity: SnippetRedisEntity = {
			id,
			title: input.title || "Untitled",
			code: input.code,
			language: input.language,
			createdAt: now,
			expiresAt,
			burnAfterRead: isBurn,
			passwordHash,
			salt,
			maxViews: input.maxViews || null,
			viewCount: 0
		};

		await this.snippetRepository.save(entity, input.ttlSeconds);

		return { id, expiresAt };
	}

	async getSnippetById(id: string, clientPassword?: string): Promise<SnippetResponse> {
		const snippet = await this.snippetRepository.findById(id);

		if (!snippet) {
			throw new AppError("Snippet not found or has expired", 404, "SNIPPET_NOT_FOUND");
		}

		const isProtected = Boolean(snippet.passwordHash && snippet.salt);

		if (isProtected) {
			const hasValidPassword =
				clientPassword &&
				verifyPassword(clientPassword, snippet.passwordHash!, snippet.salt!);

			if (!hasValidPassword) {
				return {
					id: snippet.id,
					title: snippet.title,
					code: null,
					language: snippet.language,
					createdAt: snippet.createdAt,
					expiresAt: snippet.expiresAt,
					burnAfterRead: snippet.burnAfterRead,
					isProtected: true,
					remainingViews: snippet.maxViews ? Math.max(0, snippet.maxViews - snippet.viewCount) : null,
					viewsCount: snippet.viewCount
				};
			}
		}

		snippet.viewCount += 1;
		const remainingViews = snippet.maxViews ? Math.max(0, snippet.maxViews - snippet.viewCount) : null;

		const shouldBurn = snippet.burnAfterRead || (snippet.maxViews !== null && snippet.viewCount >= snippet.maxViews);

		if (shouldBurn) {
			await this.snippetRepository.delete(id);
		} else {
			await this.snippetRepository.update(snippet);
		}

		return {
			id: snippet.id,
			title: snippet.title,
			code: snippet.code,
			language: snippet.language,
			createdAt: snippet.createdAt,
			expiresAt: snippet.expiresAt,
			burnAfterRead: snippet.burnAfterRead,
			isProtected,
			remainingViews,
			viewsCount: snippet.viewCount
		};
	}

	async unlockSnippet(id: string, input: UnlockSnippetInput): Promise<SnippetResponse> {
		const snippet = await this.snippetRepository.findById(id);

		if (!snippet) {
			throw new AppError("Snippet not found or has expired", 404, "SNIPPET_NOT_FOUND");
		}

		if (!snippet.passwordHash || !snippet.salt) {
			return this.getSnippetById(id);
		}

		const isValid = verifyPassword(input.password, snippet.passwordHash, snippet.salt);
		if (!isValid) {
			throw new AppError("Invalid password for protected snippet", 401, "INVALID_PASSWORD");
		}

		return this.getSnippetById(id, input.password);
	}

	async deleteSnippet(id: string): Promise<boolean> {
		return await this.snippetRepository.delete(id);
	}
}