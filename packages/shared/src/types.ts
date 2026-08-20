import { z } from "zod";
import {
	CreateSnippetSchema,
	FetchSnippetParamsSchema,
	SnippetResponseSchema,
	UnlockSnippetSchema
} from "./schemas";
import { SupportedLanguage } from "./constants";

export type CreateSnippetInput = z.infer<typeof CreateSnippetSchema>;
export type FetchSnippetParams = z.infer<typeof FetchSnippetParamsSchema>;
export type UnlockSnippetInput = z.infer<typeof UnlockSnippetSchema>;
export type SnippetResponse = z.infer<typeof SnippetResponseSchema>;

export interface SnippetRedisEntity {
	id: string;
	title: string;
	code: string;
	language: SupportedLanguage;
	createdAt: number;
	expiresAt: number | null;
	burnAfterRead: boolean;
	passwordHash: string | null;
	salt: string | null;
	maxViews: number | null;
	viewCount: number;
}

export interface ApiSuccessResponse<T> {
	success: true;
	data: T;
	timestamp: number;
}

export interface ApiErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Record<string, unknown> | Array<unknown>;
	};
	timestamp: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;