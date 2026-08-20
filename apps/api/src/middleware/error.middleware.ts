import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiErrorResponse } from "@pastebin/shared";

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly details?: Record<string, unknown> | Array<unknown>;

	constructor(
		message: string,
		statusCode = 500,
		code = "INTERNAL_SERVER_ERROR",
		details?: Record<string, unknown> | Array<unknown>
	) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	const timestamp = Date.now();

	if (err instanceof AppError) {
		const payload: ApiErrorResponse = {
			success: false,
			error: {
				code: err.code,
				message: err.message,
				details: err.details
			},
			timestamp
		};
		res.status(err.statusCode).json(payload);
		return;
	}

	if (err instanceof ZodError) {
		const payload: ApiErrorResponse = {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Invalid request payload or parameters",
				details: err.issues
			},
			timestamp
		};
		res.status(400).json(payload);
		return;
	}

	console.error("[UnhandledException]", err);

	const fallbackResponse: ApiErrorResponse = {
		success: false,
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected internal server error occurred"
		},
		timestamp
	};

	res.status(500).json(fallbackResponse);
}