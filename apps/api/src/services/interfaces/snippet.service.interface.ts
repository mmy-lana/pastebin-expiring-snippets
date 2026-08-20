import {
	CreateSnippetInput,
	SnippetResponse,
	UnlockSnippetInput
} from "@pastebin/shared";

export interface ISnippetService {
	createSnippet(input: CreateSnippetInput): Promise<{ id: string; expiresAt: number | null }>;
	getSnippetById(id: string, clientPassword?: string): Promise<SnippetResponse>;
	unlockSnippet(id: string, input: UnlockSnippetInput): Promise<SnippetResponse>;
	deleteSnippet(id: string): Promise<boolean>;
}