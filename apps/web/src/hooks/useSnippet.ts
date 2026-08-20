import { useState, useCallback } from "react";
import { CreateSnippetInput, SnippetResponse } from "@pastebin/shared";
import { api } from "../services/api";

export function useSnippet() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [snippet, setSnippet] = useState<SnippetResponse | null>(null);
	const [createdResult, setCreatedResult] = useState<{ id: string; expiresAt: number | null } | null>(null);

	const clearError = useCallback(() => setError(null), []);

	const createSnippet = useCallback(async (input: CreateSnippetInput) => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await api.createSnippet(input);
			setCreatedResult(result);
			return result;
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Failed to create snippet";
			setError(msg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchSnippet = useCallback(async (id: string, password?: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await api.getSnippet(id, password);
			setSnippet(data);
			return data;
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Snippet not found or has expired";
			setError(msg);
			setSnippet(null);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const unlockSnippet = useCallback(async (id: string, password: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await api.unlockSnippet(id, password);
			setSnippet(data);
			return data;
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Invalid password";
			setError(msg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteSnippet = useCallback(async (id: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await api.deleteSnippet(id);
			setSnippet(null);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Failed to delete snippet";
			setError(msg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		isLoading,
		error,
		snippet,
		createdResult,
		clearError,
		createSnippet,
		fetchSnippet,
		unlockSnippet,
		deleteSnippet,
		resetCreatedResult: () => setCreatedResult(null),
		resetSnippet: () => setSnippet(null)
	};
}