import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface TerminalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "cyber" | "danger" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	icon?: React.ReactNode;
}

export const TerminalButton = React.forwardRef<HTMLButtonElement, TerminalButtonProps>(
	({ className, variant = "primary", size = "md", isLoading, icon, children, disabled, ...props }, ref) => {
		const baseStyles =
			"inline-flex items-center justify-center font-mono font-medium transition-all duration-150 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider select-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-neutral-950";

		const sizeStyles = {
			sm: "px-2.5 py-1 text-xs gap-1.5",
			md: "px-4 py-2 text-sm gap-2",
			lg: "px-6 py-3 text-base gap-2.5"
		};

		const variantStyles = {
			primary:
				"bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] focus:ring-emerald-400",
			cyber:
				"bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] focus:ring-cyan-400",
			danger:
				"bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 hover:border-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.35)] focus:ring-red-400",
			outline:
				"bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-neutral-500 focus:ring-neutral-400",
			ghost:
				"bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-transparent focus:ring-neutral-600"
		};

		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
				{...props}
			>
				{isLoading ? (
					<Loader2 className="w-4 h-4 animate-spin text-current" />
				) : (
					icon && <span className="shrink-0">{icon}</span>
				)}
				<span>{children}</span>
			</button>
		);
	}
);

TerminalButton.displayName = "TerminalButton";