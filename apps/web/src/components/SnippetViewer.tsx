import React, { useState } from "react";
import { SnippetResponse } from "@pastebin/shared";
import { TerminalBadge } from "./ui/TerminalBadge";
import { TerminalButton } from "./ui/TerminalButton";
import { TerminalModal } from "./ui/TerminalModal";
import { TerminalInput } from "./ui/TerminalInput";
import { formatTimeRemaining } from "../lib/utils";
import { useClipboard } from "../hooks/useClipboard";
import {
	Copy,
	Check,
	Flame,
	Clock,
	Lock,
	Eye,
	Trash2,
	Unlock,
	Terminal,
	Code2
} from "lucide-react";

interface SnippetViewerProps {
	snippet: SnippetResponse;
	onUnlock: (password: string) => Promise<unknown>;
	onDelete: (id: string) => Promise<unknown>;
	isLoading?: boolean;
}

export const SnippetViewer: React.FC<SnippetViewerProps> = ({
	snippet,
	onUnlock,
	onDelete,
	isLoading
}) => {
	const { copied, copy } = useClipboard();
	const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
	const [unlockPassword, setUnlockPassword] = useState("");
	const [isSubmittingUnlock, setIsSubmittingUnlock] = useState(false);

	const isLocked = snippet.isProtected && snippet.code === null;

	const handleUnlockSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!unlockPassword) return;
		setIsSubmittingUnlock(true);
		try {
			await onUnlock(unlockPassword);
			setIsUnlockModalOpen(false);
			setUnlockPassword("");
		} finally {
			setIsSubmittingUnlock(false);
		}
	};

	return (
		<div className="space-y-4">
			{/* Metadata bar */}
			<div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Terminal className="w-4 h-4 text-emerald-400" />
						<h2 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
							{snippet.title}
						</h2>
					</div>
					<div className="text-xs text-neutral-500 font-mono">
						NODE_ID: <span className="text-neutral-300 font-semibold">{snippet.id}</span> |
						CREATED: {new Date(snippet.createdAt).toLocaleTimeString()}
					</div>
				</div>

				<div className="flex flex-wrap gap-2 items-center">
					<TerminalBadge variant="neutral" icon={<Code2 className="w-3 h-3" />}>
						{snippet.language}
					</TerminalBadge>

					{snippet.burnAfterRead ? (
						<TerminalBadge variant="red" icon={<Flame className="w-3 h-3" />}>
							BURN ON READ
						</TerminalBadge>
					) : (
						<TerminalBadge variant="cyan" icon={<Clock className="w-3 h-3" />}>
							{formatTimeRemaining(snippet.expiresAt)}
						</TerminalBadge>
					)}

					{snippet.isProtected && (
						<TerminalBadge variant="amber" icon={<Lock className="w-3 h-3" />}>
							PROTECTED
						</TerminalBadge>
					)}

					{snippet.remainingViews !== null && (
						<TerminalBadge variant="neutral" icon={<Eye className="w-3 h-3" />}>
							{snippet.remainingViews} READS LEFT
						</TerminalBadge>
					)}
				</div>
			</div>

			{/* Locked state representation */}
			{isLocked ? (
				<div className="bg-black/90 border border-amber-500/30 rounded-lg p-8 text-center space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
					<div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400">
						<Lock className="w-6 h-6" />
					</div>
					<div className="space-y-1 max-w-sm mx-auto">
						<h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
							ENCRYPTED PAYLOAD LOCKED
						</h3>
						<p className="text-xs text-neutral-400">
							This snippet is locked with a security passphrase. Provide the secret key to decrypt buffer.
						</p>
					</div>
					<TerminalButton
						variant="cyber"
						size="md"
						onClick={() => setIsUnlockModalOpen(true)}
						icon={<Unlock className="w-4 h-4" />}
					>
						UNLOCK PAYLOAD
					</TerminalButton>
				</div>
			) : (
				/* Code display container */
				<div className="relative group">
					<div className="absolute top-3 right-3 flex items-center gap-2 z-10">
						<TerminalButton
							variant="outline"
							size="sm"
							onClick={() => copy(snippet.code || "")}
							icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
						>
							{copied ? "COPIED" : "COPY RAW"}
						</TerminalButton>
						<TerminalButton
							variant="danger"
							size="sm"
							onClick={() => onDelete(snippet.id)}
							isLoading={isLoading}
							icon={<Trash2 className="w-3.5 h-3.5" />}
						>
							PURGE
						</TerminalButton>
					</div>

					<pre className="bg-black/90 border border-neutral-800 rounded-lg p-4 pt-12 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed tracking-wide shadow-inner max-h-[500px]">
						<code>{snippet.code}</code>
					</pre>
				</div>
			)}

			{/* Passphrase Unlock Modal */}
			<TerminalModal
				isOpen={isUnlockModalOpen}
				onClose={() => setIsUnlockModalOpen(false)}
				title="PASSPHRASE_DECRYPTION"
			>
				<form onSubmit={handleUnlockSubmit} className="space-y-4">
					<TerminalInput
						label="PASSPHRASE KEY"
						type="password"
						autoFocus
						placeholder="ENTER_SECRET_KEY"
						value={unlockPassword}
						onChange={(e) => setUnlockPassword(e.target.value)}
						icon={<Lock className="w-3.5 h-3.5 text-amber-400" />}
						required
					/>
					<div className="flex justify-end gap-2">
						<TerminalButton
							type="button"
							variant="ghost"
							size="md"
							onClick={() => setIsUnlockModalOpen(false)}
						>
							CANCEL
						</TerminalButton>
						<TerminalButton
							type="submit"
							variant="primary"
							size="md"
							isLoading={isSubmittingUnlock}
							icon={<Unlock className="w-3.5 h-3.5" />}
						>
							DECRYPT
						</TerminalButton>
					</div>
				</form>
			</TerminalModal>
		</div>
	);
};