import React, { useState } from "react";
import {
	ExpirationOptions,
	SUPPORTED_LANGUAGES,
	SupportedLanguage,
	CreateSnippetInput
} from "@pastebin/shared";
import { TerminalInput } from "./ui/TerminalInput";
import { TerminalSelect } from "./ui/TerminalSelect";
import { TerminalTextarea } from "./ui/TerminalTextarea";
import { TerminalButton } from "./ui/TerminalButton";
import { Lock, Send, Sparkles, KeyRound, Eye } from "lucide-react";

interface SnippetEditorProps {
	onSubmit: (payload: CreateSnippetInput) => Promise<void>;
	isLoading?: boolean;
}

export const SnippetEditor: React.FC<SnippetEditorProps> = ({ onSubmit, isLoading }) => {
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState<SupportedLanguage>("typescript");
	const [ttl, setTtl] = useState<number>(ExpirationOptions.TWENTY_FOUR_HOURS);
	const [password, setPassword] = useState("");
	const [maxViews, setMaxViews] = useState<string>("");
	const [showAdvanced, setShowAdvanced] = useState(false);

	const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
		value: lang,
		label: lang.toUpperCase()
	}));

	const expirationOptions = [
		{ value: ExpirationOptions.BURN_AFTER_READ, label: "🔥 BURN AFTER READING" },
		{ value: ExpirationOptions.FIVE_MINUTES, label: "⏳ 5 MINUTES" },
		{ value: ExpirationOptions.TEN_MINUTES, label: "⏳ 10 MINUTES" },
		{ value: ExpirationOptions.ONE_HOUR, label: "⏳ 1 HOUR" },
		{ value: ExpirationOptions.TWENTY_FOUR_HOURS, label: "⏳ 24 HOURS" },
		{ value: ExpirationOptions.SEVEN_DAYS, label: "⏳ 7 DAYS" },
		{ value: ExpirationOptions.THIRTY_DAYS, label: "⏳ 30 DAYS" }
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) return;

		const payload: CreateSnippetInput = {
			title: title.trim() || "Untitled",
			code,
			language,
			ttlSeconds: ttl,
			password: password.trim() ? password : undefined,
			maxViews: maxViews ? parseInt(maxViews, 10) : undefined
		};

		await onSubmit(payload);
		setCode("");
		setTitle("");
		setPassword("");
		setMaxViews("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div className="md:col-span-1">
					<TerminalInput
						label="SNIPPET TITLE"
						placeholder="E.G. AUTH_MIDDLEWARE"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<TerminalSelect
						label="SYNTAX"
						options={languageOptions}
						value={language}
						onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
					/>
				</div>
				<div>
					<TerminalSelect
						label="SELF-DESTRUCT TTL"
						options={expirationOptions}
						value={ttl}
						onChange={(e) => setTtl(Number(e.target.value))}
					/>
				</div>
			</div>

			<TerminalTextarea
				label="SOURCE BUFFER"
				placeholder="// Paste code snippet or payload buffer here..."
				value={code}
				onChange={(e) => setCode(e.target.value)}
				showLineNumbers
				required
			/>

			{/* Advanced Security Configuration Drawer */}
			<div className="border border-neutral-800/80 rounded bg-black/40 p-3 space-y-3">
				<button
					type="button"
					onClick={() => setShowAdvanced((prev) => !prev)}
					className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-emerald-400 font-mono transition-colors"
				>
					<KeyRound className="w-3.5 h-3.5 text-cyan-400" />
					<span>{showAdvanced ? "[-] HIDE ACCESS RESTRICTIONS" : "[+] EXPAND ACCESS RESTRICTIONS"}</span>
				</button>

				{showAdvanced && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/60 animate-in fade-in duration-150">
						<TerminalInput
							label="PASSPHRASE ENCRYPTION (OPTIONAL)"
							type="password"
							placeholder="PROTECTION PASSPHRASE"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							icon={<Lock className="w-3.5 h-3.5 text-amber-400" />}
						/>
						<TerminalInput
							label="MAX READ QUOTA (OPTIONAL)"
							type="number"
							min="1"
							max="10000"
							placeholder="EXPIRE AFTER N VIEWS"
							value={maxViews}
							onChange={(e) => setMaxViews(e.target.value)}
							icon={<Eye className="w-3.5 h-3.5 text-cyan-400" />}
						/>
					</div>
				)}
			</div>

			<div className="flex justify-end">
				<TerminalButton
					type="submit"
					variant="primary"
					size="lg"
					isLoading={isLoading}
					icon={<Send className="w-4 h-4" />}
					disabled={!code.trim()}
				>
					DEPLOY EXPIRING SNIPPET
				</TerminalButton>
			</div>
		</form>
	);
};