import React from "react";
import { cn } from "../../lib/utils";

export interface TerminalCardProps {
	title?: string;
	statusBadge?: React.ReactNode;
	headerActions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "glow" | "danger";
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
	title = "TERMINAL_NODE",
	statusBadge,
	headerActions,
	children,
	className,
	variant = "default"
}) => {
	const borderStyles = {
		default: "border-neutral-800 hover:border-neutral-700",
		glow: "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]",
		danger: "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
	};

	return (
		<div
			className={cn(
				"bg-neutral-950/80 backdrop-blur border rounded-lg overflow-hidden flex flex-col font-mono",
				borderStyles[variant],
				className
			)}
		>
			{/* Terminal window top bar */}
			<div className="bg-neutral-900/90 px-4 py-2 border-b border-neutral-800/80 flex items-center justify-between select-none">
				<div className="flex items-center gap-2">
					<div className="flex gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
						<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
					</div>
					<span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider pl-2 border-l border-neutral-800">
						{title}
					</span>
					{statusBadge}
				</div>
				{headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
			</div>
			{/* Card content body */}
			<div className="p-5 flex-1">{children}</div>
		</div>
	);
};