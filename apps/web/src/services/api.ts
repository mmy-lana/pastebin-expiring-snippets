import {
	ApiErrorResponse,
	ApiSuccessResponse,
	CreateSnippetInput,
	SnippetResponse
} from "@pastebin/shared";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

class ApiError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly statusCode: number,
		public readonly details?: unknown
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE}${path}`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>)
	};

	const response = await fetch(url, { ...options, headers });
	const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

	if (!response.ok || !json.success) {
		const errorObj = "error" in json ? json.error : { code: "HTTP_ERROR", message: response.statusText };
		let formattedMessage = errorObj.message || "Failed to process API request";

		if ("error" in json && Array.isArray(json.error.details) && json.error.details.length > 0) {
			formattedMessage = json.error.details
				.map((issue: unknown) => {
					if (typeof issue === "object" && issue !== null) {
						const rec = issue as Record<string, unknown>;
						const path = Array.isArray(rec.path) ? rec.path.join(".") : "";
						const msg = typeof rec.message === "string" ? rec.message : JSON.stringify(rec);
						return path ? `[${path}]: ${msg}` : msg;
					}
					return String(issue);
				})
				.join(" | ");
		}

		throw new ApiError(
			formattedMessage,
			errorObj.code || "REQUEST_FAILED",
			response.status,
			"error" in json ? json.error.details : undefined
		);
	}

	return json.data;
}

export const api = {
	async createSnippet(
		input: CreateSnippetInput
	): Promise<{ id: string; expiresAt: number | null }> {
		return request<{ id: string; expiresAt: number | null }>("/api/snippets", {
			method: "POST",
			body: JSON.stringify(input)
		});
	},

	async getSnippet(id: string, password?: string): Promise<SnippetResponse> {
		const headers: Record<string, string> = {};
		if (password) {
			headers["x-snippet-password"] = password;
		}
		return request<SnippetResponse>(`/api/snippets/${id}`, {
			method: "GET",
			headers
		});
	},

	async unlockSnippet(id: string, password: string): Promise<SnippetResponse> {
		return request<SnippetResponse>(`/api/snippets/${id}/unlock`, {
			method: "POST",
			body: JSON.stringify({ password })
		});
	},

	async deleteSnippet(id: string): Promise<{ id: string; deleted: boolean }> {
		return request<{ id: string; deleted: boolean }>(`/api/snippets/${id}`, {
			method: "DELETE"
		});
	},

	async checkHealth(): Promise<{ status: string; redis: string; uptime: number }> {
		const res = await fetch(`${API_BASE}/healthz`);
		return res.json();
	}
};