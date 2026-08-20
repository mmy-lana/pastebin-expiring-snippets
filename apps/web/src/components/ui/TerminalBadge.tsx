import React from "react";
import { cn } from "../../lib/utils";

export interface TerminalBadgeProps {
	variant?: "emerald" | "cyan" | "red" | "amber" | "neutral";
	icon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export const TerminalBadge: React.FC<TerminalBadgeProps> = ({
	variant = "emerald",
	icon,
	children,
	className
}) => {
	const variants = {
		emerald: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
		cyan: "bg-cyan-950/60 text-cyan-400 border-cyan-800/60",
		red: "bg-red-950/60 text-red-400 border-red-800/60",
		amber: "bg-amber-950/60 text-amber-400 border-amber-800/60",
		neutral: "bg-neutral-900 text-neutral-400 border-neutral-800"
	};

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border uppercase tracking-wider select-none",
				variants[variant],
				className
			)}
		>
			{icon && <span className="shrink-0">{icon}</span>}
			<span>{children}</span>
		</span>
	);
};