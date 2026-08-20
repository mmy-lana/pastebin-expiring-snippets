import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function formatTimeRemaining(expiresAt: number | null): string {
	if (!expiresAt) return "BURN ON READ";
	const diffMs = expiresAt - Date.now();
	if (diffMs <= 0) return "EXPIRED";

	const totalSeconds = Math.floor(diffMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 24) {
		const days = Math.floor(hours / 24);
		return `${days}d ${hours % 24}h remaining`;
	}
	if (hours > 0) {
		return `${hours}h ${minutes}m remaining`;
	}
	if (minutes > 0) {
		return `${minutes}m ${seconds}s remaining`;
	}
	return `${seconds}s remaining`;
}