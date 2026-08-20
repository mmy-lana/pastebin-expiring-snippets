import React from "react";
import { cn } from "../../lib/utils";

export interface TerminalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	showLineNumbers?: boolean;
}

export const TerminalTextarea = React.forwardRef<HTMLTextAreaElement, TerminalTextareaProps>(
	({ className, label, error, value, showLineNumbers = false, ...props }, ref) => {
		const lineCount = typeof value === "string" ? Math.max(1, value.split("\n").length) : 1;

		return (
			<div className="w-full space-y-1.5 font-mono">
				{label && (
					<div className="flex justify-between items-center text-xs uppercase tracking-wider text-neutral-400 font-medium">
						<span>
							<span className="text-emerald-500 mr-1.5">[SRC]</span>
							{label}
						</span>
						{typeof value === "string" && (
							<span className="text-neutral-500 lowercase">
								{value.length} chars | {lineCount} lines
							</span>
						)}
					</div>
				)}
				<div
					className={cn(
						"flex bg-black/90 border rounded border-neutral-800 focus-within:border-emerald-500 focus-within:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all overflow-hidden",
						error && "border-red-500"
					)}
				>
					{showLineNumbers && (
						<div className="bg-neutral-950 px-2.5 py-3 border-r border-neutral-800/80 text-neutral-600 text-xs select-none text-right font-mono min-w-8">
							{Array.from({ length: lineCount }).map((_, i) => (
								<div key={i}>{i + 1}</div>
							))}
						</div>
					)}
					<textarea
						ref={ref}
						value={value}
						spellCheck={false}
						className={cn(
							"w-full bg-transparent p-3 text-sm text-emerald-300/90 font-mono placeholder-neutral-700 outline-none resize-y min-h-64 leading-relaxed tracking-wide",
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

TerminalTextarea.displayName = "TerminalTextarea";