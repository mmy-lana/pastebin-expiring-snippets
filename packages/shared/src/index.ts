import { z } from "zod";

export const ExpirationOptions = {
	TEN_MINUTES: 600,
	ONE_HOUR: 3600,
	TWENTY_FOUR_HOURS: 86400,
	SEVEN_DAYS: 604800,
	BURN_AFTER_READ: 0
} as const;

export const CreateSnippetSchema = z.object({
	title: z.string().max(100).optional().default("Untitled"),
	code: z.string().min(1, "Snippet content cannot be empty"),
	language: z.string().default("plaintext"),
	ttlSeconds: z.nativeEnum(ExpirationOptions).default(ExpirationOptions.TWENTY_FOUR_HOURS)
});

export type CreateSnippetInput = z.infer<typeof CreateSnippetSchema>;

export interface SnippetResponse {
	id: string;
	title: string;
	code: string;
	language: string;
	createdAt: number;
	expiresAt: number | null;
	burnAfterRead: boolean;
}