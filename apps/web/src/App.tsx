import React, { useEffect, useState } from "react";
import { useSnippet } from "./hooks/useSnippet";
import { useClipboard } from "./hooks/useClipboard";
import { TerminalCard } from "./components/ui/TerminalCard";
import { TerminalAlert } from "./components/ui/TerminalAlert";
import { TerminalButton } from "./components/ui/TerminalButton";
import { TerminalBadge } from "./components/ui/TerminalBadge";
import { SnippetEditor } from "./components/SnippetEditor";
import { SnippetViewer } from "./components/SnippetViewer";
import { SnippetLookup } from "./components/SnippetLookup";
import { api } from "./services/api";
import {
	Terminal,
	ShieldCheck,
	Activity,
	Copy,
	Check,
	ExternalLink,
	Plus,
	Search
} from "lucide-react";

export default function App() {
	const {
		isLoading,
		error,
		snippet,
		createdResult,
		clearError,
		createSnippet,
		fetchSnippet,
		unlockSnippet,
		deleteSnippet,
		resetCreatedResult
	} = useSnippet();

	const { copied, copy } = useClipboard();
	const [activeTab, setActiveTab] = useState<"create" | "lookup">("create");
	const [systemHealth, setSystemHealth] = useState<{ status: string; redis: string } | null>(null);

	// Load snippet ID directly from URL hash if provided (#demo-ts01)
	useEffect(() => {
		const hash = window.location.hash.replace("#", "").trim();
		if (hash) {
			fetchSnippet(hash).catch(() => { });
			setActiveTab("lookup");
		}

		api.checkHealth()
			.then(setSystemHealth)
			.catch(() => setSystemHealth({ status: "offline", redis: "error" }));
	}, [fetchSnippet]);

	const handleShareLink = (id: string) => {
		const shareUrl = `${window.location.origin}/#${id}`;
		copy(shareUrl);
	};

	return (
		<div className="min-h-screen bg-black text-neutral-200 font-mono flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
			{/* Top Terminal System Header */}
			<header className="border-b border-neutral-800/90 bg-neutral-950/80 backdrop-blur sticky top-0 z-40">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
							<Terminal className="w-5 h-5" />
						</div>
						<div>
							<h1 className="text-sm font-bold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
								<span>EXPIRING_PASTEBIN</span>
								<span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
									v1.0.0
								</span>
							</h1>
							<p className="text-[11px] text-neutral-500">
								Encrypted, self-destructing memory buffers powered by Upstash Redis
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{systemHealth && (
							<TerminalBadge
								variant={systemHealth.redis === "connected" ? "emerald" : "red"}
								icon={<Activity className="w-3 h-3" />}
							>
								{systemHealth.redis === "connected" ? "REDIS_ACTIVE" : "REDIS_ERR"}
							</TerminalBadge>
						)}

						<div className="hidden sm:flex gap-1.5">
							<TerminalButton
								variant={activeTab === "create" ? "primary" : "ghost"}
								size="sm"
								onClick={() => setActiveTab("create")}
								icon={<Plus className="w-3.5 h-3.5" />}
							>
								NEW_BUFFER
							</TerminalButton>
							<TerminalButton
								variant={activeTab === "lookup" ? "cyber" : "ghost"}
								size="sm"
								onClick={() => setActiveTab("lookup")}
								icon={<Search className="w-3.5 h-3.5" />}
							>
								RETRIEVE
							</TerminalButton>
						</div>
					</div>
				</div>
			</header>

			{/* Main Workspace Frame */}
			<main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
				{error && (
					<TerminalAlert variant="danger" title="SYSTEM_EXCEPTION" onDismiss={clearError}>
						{error}
					</TerminalAlert>
				)}

				{/* Deployment Confirmation Banner */}
				{createdResult && (
					<div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg space-y-3 shadow-[0_0_20px_rgba(16,185,129,0.12)] animate-in fade-in duration-150">
						<div className="flex items-center justify-between">
							<span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
								<ShieldCheck className="w-4 h-4" /> SNIPPET BUFFER DEPLOYED TO UPSTASH REDIS
							</span>
							<button
								onClick={resetCreatedResult}
								className="text-neutral-500 hover:text-white text-xs font-mono"
							>
								[DISMISS]
							</button>
						</div>
						<div className="flex flex-wrap items-center gap-2 bg-black/80 p-2.5 rounded border border-neutral-800">
							<code className="text-sm text-emerald-300 font-semibold flex-1">
								{createdResult.id}
							</code>
							<TerminalButton
								variant="primary"
								size="sm"
								onClick={() => handleShareLink(createdResult.id)}
								icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
							>
								{copied ? "COPIED_LINK" : "SHARE_LINK"}
							</TerminalButton>
							<TerminalButton
								variant="outline"
								size="sm"
								onClick={() => {
									fetchSnippet(createdResult.id);
									setActiveTab("lookup");
								}}
								icon={<ExternalLink className="w-3.5 h-3.5" />}
							>
								VIEW
							</TerminalButton>
						</div>
					</div>
				)}

				{/* Mobile tab bar */}
				<div className="flex sm:hidden gap-2 border-b border-neutral-800 pb-2">
					<TerminalButton
						className="flex-1"
						variant={activeTab === "create" ? "primary" : "outline"}
						size="sm"
						onClick={() => setActiveTab("create")}
					>
						DEPLOY BUFFER
					</TerminalButton>
					<TerminalButton
						className="flex-1"
						variant={activeTab === "lookup" ? "cyber" : "outline"}
						size="sm"
						onClick={() => setActiveTab("lookup")}
					>
						FETCH BUFFER
					</TerminalButton>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Left / Active Tab Panel */}
					<section className={activeTab === "create" ? "lg:col-span-12" : "lg:col-span-5"}>
						{activeTab === "create" ? (
							<TerminalCard title="SECURE_BUFFER_DISPATCHER" variant="glow">
								<SnippetEditor onSubmit={createSnippet} isLoading={isLoading} />
							</TerminalCard>
						) : (
							<TerminalCard title="SEARCH_TERMINAL_NODE" variant="default">
								<div className="space-y-4">
									<SnippetLookup onFetch={fetchSnippet} isLoading={isLoading} />
									<div className="text-xs text-neutral-500 pt-2 border-t border-neutral-800/80 space-y-1">
										<p className="font-semibold text-neutral-400 uppercase tracking-wide">
											DEMO SNIPPET SEEDS:
										</p>
										<div className="flex flex-wrap gap-1.5 pt-1">
											{["demo-ts01", "demo-py02", "demo-burn", "demo-lock"].map((id) => (
												<button
													key={id}
													onClick={() => fetchSnippet(id)}
													className="text-[11px] px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
												>
													${id}
												</button>
											))}
										</div>
									</div>
								</div>
							</TerminalCard>
						)}
					</section>

					{/* Right / Snippet Viewer Panel */}
					{activeTab === "lookup" && (
						<section className="lg:col-span-7">
							<TerminalCard
								title={snippet ? `BUFFER_READER :: ${snippet.id}` : "BUFFER_STANDBY"}
								variant={snippet?.burnAfterRead ? "danger" : "glow"}
							>
								{snippet ? (
									<SnippetViewer
										snippet={snippet}
										onUnlock={(pwd) => unlockSnippet(snippet.id, pwd)}
										onDelete={deleteSnippet}
										isLoading={isLoading}
									/>
								) : (
									<div className="p-12 text-center text-neutral-600 font-mono text-xs uppercase tracking-widest space-y-2">
										<div>[ STANDBY FOR INCOMING SNIPPET ID ]</div>
										<p className="text-neutral-700 text-[11px]">
											Enter a valid memory node ID above to retrieve and render payload.
										</p>
									</div>
								)}
							</TerminalCard>
						</section>
					)}
				</div>
			</main>

			{/* Terminal Footer */}
			<footer className="border-t border-neutral-800/80 bg-neutral-950 py-3 text-center text-[11px] text-neutral-500 font-mono select-none">
				<div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
					<div>
						SYS_STATUS: <span className="text-emerald-400">OPERATIONAL</span> | PROTOCOL:{" "}
						<span className="text-cyan-400">HTTPS_REST_REDIS</span>
					</div>
					<div>ZERO_LOG_ENCRYPTED_EPHEMERAL_STORAGE</div>
				</div>
			</footer>
		</div>
	);
}