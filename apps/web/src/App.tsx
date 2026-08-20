import React, { useState } from "react";
import { ExpirationOptions, type SnippetResponse } from "@pastebin/shared";
import { Clock, Flame, Send, Copy, Check } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("typescript");
	const [ttl, setTtl] = useState<number>(ExpirationOptions.TWENTY_FOUR_HOURS);
	const [createdId, setCreatedId] = useState<string | null>(null);
	const [lookupId, setLookupId] = useState("");
	const [snippet, setSnippet] = useState<SnippetResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const res = await fetch(`${API_URL}/api/snippets`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, code, language, ttlSeconds: ttl })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create snippet");
			setCreatedId(data.id);
			setCode("");
			setTitle("");
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleFetch = async (id: string) => {
		setError(null);
		setSnippet(null);
		try {
			const res = await fetch(`${API_URL}/api/snippets/${id}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Snippet not found or expired");
			setSnippet(data);
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<header className="border-b border-neutral-800 pb-4">
				<h1 className="text-3xl font-bold text-emerald-400">⚡ Expiring Pastebin</h1>
				<p className="text-neutral-400 text-sm mt-1">Share code snippets that automatically self-destruct.</p>
			</header>

			{error && <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 rounded text-sm">{error}</div>}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Create Snippet Form */}
				<form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900/60 p-5 border border-neutral-800 rounded-xl">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<Send className="w-4 h-4 text-emerald-400" /> Create Snippet
					</h2>

					<input
						type="text"
						placeholder="Title (optional)"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm focus:border-emerald-500 outline-none"
					/>

					<select
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
						className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm outline-none"
					>
						<option value="typescript">TypeScript</option>
						<option value="javascript">JavaScript</option>
						<option value="python">Python</option>
						<option value="json">JSON</option>
						<option value="plaintext">Plaintext</option>
					</select>

					<select
						value={ttl}
						onChange={(e) => setTtl(Number(e.target.value))}
						className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm outline-none"
					>
						<option value={ExpirationOptions.BURN_AFTER_READ}>🔥 Burn After Reading</option>
						<option value={ExpirationOptions.TEN_MINUTES}>⏳ 10 Minutes</option>
						<option value={ExpirationOptions.ONE_HOUR}>⏳ 1 Hour</option>
						<option value={ExpirationOptions.TWENTY_FOUR_HOURS}>⏳ 24 Hours</option>
						<option value={ExpirationOptions.SEVEN_DAYS}>⏳ 7 Days</option>
					</select>

					<textarea
						required
						placeholder="Paste your code here..."
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className="w-full h-48 bg-neutral-950 border border-neutral-800 rounded p-3 text-sm font-mono focus:border-emerald-500 outline-none resize-none"
					/>

					<button
						type="submit"
						className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition"
					>
						Create Secret Snippet
					</button>
				</form>

				{/* View / Lookup Snippet */}
				<div className="space-y-4">
					{createdId && (
						<div className="p-4 bg-emerald-950/30 border border-emerald-800 rounded-xl space-y-2">
							<span className="text-xs text-emerald-400 font-semibold uppercase">Snippet Created!</span>
							<div className="flex items-center justify-between bg-neutral-950 p-2 rounded border border-neutral-800">
								<code className="text-sm">{createdId}</code>
								<button
									onClick={() => {
										navigator.clipboard.writeText(createdId);
										setCopied(true);
										setTimeout(() => setCopied(false), 2000);
									}}
									className="text-neutral-400 hover:text-white"
								>
									{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
								</button>
							</div>
						</div>
					)}

					<div className="bg-neutral-900/60 p-5 border border-neutral-800 rounded-xl space-y-4">
						<h2 className="text-lg font-semibold flex items-center gap-2">
							<Clock className="w-4 h-4 text-cyan-400" /> Retrieve Snippet
						</h2>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Enter Snippet ID"
								value={lookupId}
								onChange={(e) => setLookupId(e.target.value)}
								className="flex-1 bg-neutral-950 border border-neutral-800 rounded p-2 text-sm outline-none"
							/>
							<button
								onClick={() => handleFetch(lookupId)}
								className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded text-sm font-medium"
							>
								Fetch
							</button>
						</div>

						{snippet && (
							<div className="mt-4 space-y-2 border-t border-neutral-800 pt-4">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-neutral-200">{snippet.title}</h3>
									{snippet.burnAfterRead && (
										<span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded flex items-center gap-1">
											<Flame className="w-3 h-3" /> Destroyed
										</span>
									)}
								</div>
								<pre className="bg-neutral-950 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-neutral-800">
									<code>{snippet.code}</code>
								</pre>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}