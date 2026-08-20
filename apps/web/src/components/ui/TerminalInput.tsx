import React from "react";
import { cn } from "../../lib/utils";

export interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
	prefixSymbol?: string;
}

export const TerminalInput = React.forwardRef<HTMLInputElement, TerminalInputProps>(
	({ className, label, error, icon, prefixSymbol = ">", disabled, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5 font-mono">
				{label && (
					<label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
						<span className="text-emerald-500 mr-1.5">[#]</span>
						{label}
					</label>
				)}
				<div
					className={cn(
						"flex items-center bg-black/80 border rounded border-neutral-800 focus-within:border-emerald-500 focus-within:shadow-[0_0_8px_rgba(16,185,129,0.2)] transition-all",
						error && "border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_8px_rgba(239,68,68,0.2)]",
						disabled && "opacity-50 cursor-not-allowed bg-neutral-900"
					)}
				>
					<div className="pl-3 pr-1 text-xs text-neutral-500 select-none flex items-center gap-1">
						{icon ? icon : <span>{prefixSymbol}</span>}
					</div>
					<input
						ref={ref}
						disabled={disabled}
						className={cn(
							"w-full bg-transparent px-2 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none font-mono",
							className
						)}
						{...props}
					/>
				</div>
				{error && (
					<p className="text-xs text-red-400 flex items-center gap-1 mt-1">
						<span className="text-red-500 font-bold">[!]</span> {error}
					</p>
				)}
			</div>
		);
	}
);

TerminalInput.displayName = "TerminalInput";