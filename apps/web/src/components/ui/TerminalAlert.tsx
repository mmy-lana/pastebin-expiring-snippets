import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle2, Flame, Info } from "lucide-react";

export interface TerminalAlertProps {
	variant?: "info" | "success" | "warning" | "danger";
	title?: string;
	children: React.ReactNode;
	className?: string;
	onDismiss?: () => void;
}

export const TerminalAlert: React.FC<TerminalAlertProps> = ({
	variant = "danger",
	title,
	children,
	className,
	onDismiss
}) => {
	const styles = {
		info: {
			container: "bg-cyan-950/40 border-cyan-800/80 text-cyan-300",
			icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
		},
		success: {
			container: "bg-emerald-950/40 border-emerald-800/80 text-emerald-300",
			icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
		},
		warning: {
			container: "bg-amber-950/40 border-amber-800/80 text-amber-300",
			icon: <Flame className="w-4 h-4 text-amber-400 shrink-0" />
		},
		danger: {
			container: "bg-red-950/40 border-red-800/80 text-red-300",
			icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
		}
	};

	const current = styles[variant];

	return (
		<div
			className={cn(
				"p-3.5 border rounded-lg font-mono text-xs flex items-start gap-3 relative animate-in fade-in duration-200",
				current.container,
				className
			)}
		>
			<div className="mt-0.5">{current.icon}</div>
			<div className="flex-1 space-y-1">
				{title && <div className="font-bold tracking-wide uppercase">{title}</div>}
				<div className="opacity-90 leading-relaxed break-words">{children}</div>
			</div>
			{onDismiss && (
				<button
					onClick={onDismiss}
					className="text-neutral-400 hover:text-white text-sm font-bold px-1"
				>
					×
				</button>
			)}
		</div>
	);
};