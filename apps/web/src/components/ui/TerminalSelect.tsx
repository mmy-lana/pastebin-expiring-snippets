import React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface OptionItem {
	value: string | number;
	label: string;
}

export interface TerminalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	options: OptionItem[];
	error?: string;
}

export const TerminalSelect = React.forwardRef<HTMLSelectElement, TerminalSelectProps>(
	({ className, label, options, error, disabled, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5 font-mono">
				{label && (
					<label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
						<span className="text-cyan-500 mr-1.5">[*]</span>
						{label}
					</label>
				)}
				<div
					className={cn(
						"relative flex items-center bg-black/80 border rounded border-neutral-800 focus-within:border-cyan-500 focus-within:shadow-[0_0_8px_rgba(6,182,212,0.2)] transition-all",
						error && "border-red-500",
						disabled && "opacity-50 cursor-not-allowed bg-neutral-900"
					)}
				>
					<select
						ref={ref}
						disabled={disabled}
						className={cn(
							"w-full appearance-none bg-transparent px-3 py-2 text-sm text-neutral-200 outline-none font-mono cursor-pointer pr-9",
							className
						)}
						{...props}
					>
						{options.map((opt) => (
							<option key={opt.value} value={opt.value} className="bg-neutral-950 text-neutral-200">
								{opt.label}
							</option>
						))}
					</select>
					<ChevronDown className="w-4 h-4 text-neutral-500 pointer-events-none absolute right-3" />
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

TerminalSelect.displayName = "TerminalSelect";