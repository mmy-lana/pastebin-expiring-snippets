import React, { useEffect } from "react";
import { TerminalCard } from "./TerminalCard";
import { X } from "lucide-react";

export interface TerminalModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
	isOpen,
	onClose,
	title,
	children
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
			<div className="w-full max-w-md">
				<TerminalCard
					title={title}
					variant="glow"
					headerActions={
						<button
							onClick={onClose}
							className="text-neutral-400 hover:text-white transition-colors p-1"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					}
				>
					{children}
				</TerminalCard>
			</div>
		</div>
	);
};