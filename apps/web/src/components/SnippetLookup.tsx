import React, { useState } from "react";
import { TerminalInput } from "./ui/TerminalInput";
import { TerminalButton } from "./ui/TerminalButton";
import { Search, Terminal } from "lucide-react";

interface SnippetLookupProps {
	onFetch: (id: string) => void;
	isLoading?: boolean;
}

export const SnippetLookup: React.FC<SnippetLookupProps> = ({ onFetch, isLoading }) => {
	const [lookupId, setLookupId] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = lookupId.trim();
		if (trimmed) {
			onFetch(trimmed);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 items-center">
			<div className="flex-1">
				<TerminalInput
					placeholder="ENTER_SNIPPET_ID (e.g. demo-ts01)"
					value={lookupId}
					onChange={(e) => setLookupId(e.target.value)}
					icon={<Terminal className="w-3.5 h-3.5 text-cyan-400" />}
					prefixSymbol="$"
					required
				/>
			</div>
			<TerminalButton
				type="submit"
				variant="cyber"
				size="md"
				isLoading={isLoading}
				icon={<Search className="w-3.5 h-3.5" />}
			>
				FETCH
			</TerminalButton>
		</form>
	);
};