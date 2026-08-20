import { useState, useCallback } from "react";

export function useClipboard(timeout = 2000) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(
		async (text: string): Promise<boolean> => {
			if (!navigator.clipboard) {
				console.warn("Clipboard API not available");
				return false;
			}
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), timeout);
				return true;
			} catch (err) {
				console.error("Failed to copy to clipboard", err);
				setCopied(false);
				return false;
			}
		},
		[timeout]
	);

	return { copied, copy };
}