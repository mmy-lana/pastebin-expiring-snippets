import { z } from "zod";
import { ExpirationOptions, SNIPPET_LIMITS, SUPPORTED_LANGUAGES } from "./constants.js";

export const SupportedLanguageSchema = z.enum(SUPPORTED_LANGUAGES, {
	error: () => ({ message: "Unsupported programming language specified" })
});

export const ExpirationTtlSchema = z
	.union([
		z.literal(ExpirationOptions.BURN_AFTER_READ),
		z.literal(ExpirationOptions.FIVE_MINUTES),
		z.literal(ExpirationOptions.TEN_MINUTES),
		z.literal(ExpirationOptions.ONE_HOUR),
		z.literal(ExpirationOptions.TWENTY_FOUR_HOURS),
		z.literal(ExpirationOptions.SEVEN_DAYS),
		z.literal(ExpirationOptions.THIRTY_DAYS),
		z.number().int().min(60).max(2592000)
	])
	.default(ExpirationOptions.TWENTY_FOUR_HOURS);

export const CreateSnippetSchema = z.object({
	title: z
		.string()
		.trim()
		.max(SNIPPET_LIMITS.TITLE_MAX_LENGTH, `Title cannot exceed ${SNIPPET_LIMITS.TITLE_MAX_LENGTH} characters`)
		.default("Untitled"),
	code: z
		.string()
		.min(SNIPPET_LIMITS.CONTENT_MIN_LENGTH, "Snippet content cannot be empty")
		.max(SNIPPET_LIMITS.CONTENT_MAX_LENGTH, "Snippet content exceeds maximum permissible size of 500KB"),
	language: SupportedLanguageSchema.default("plaintext"),
	ttlSeconds: ExpirationTtlSchema,
	password: z
		.string()
		.min(SNIPPET_LIMITS.PASSWORD_MIN_LENGTH, `Password must be at least ${SNIPPET_LIMITS.PASSWORD_MIN_LENGTH} characters`)
		.max(SNIPPET_LIMITS.PASSWORD_MAX_LENGTH, `Password cannot exceed ${SNIPPET_LIMITS.PASSWORD_MAX_LENGTH} characters`)
		.optional(),
	maxViews: z.number().int().positive().max(SNIPPET_LIMITS.MAX_VIEWS_LIMIT).optional()
});

export const FetchSnippetParamsSchema = z.object({
	id: z.string().trim().min(1, "Snippet ID is required")
});

export const UnlockSnippetSchema = z.object({
	password: z.string().min(1, "Password is required to decrypt this snippet")
});

export const SnippetResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	code: z.string().nullable(),
	language: SupportedLanguageSchema,
	createdAt: z.number(),
	expiresAt: z.number().nullable(),
	burnAfterRead: z.boolean(),
	isProtected: z.boolean(),
	remainingViews: z.number().nullable(),
	viewsCount: z.number()
});