import { Request, Response, NextFunction } from "express";
import {
	ApiSuccessResponse,
	CreateSnippetInput,
	FetchSnippetParams,
	SnippetResponse,
	UnlockSnippetInput
} from "@pastebin/shared";
import { ISnippetService } from "../services/interfaces/snippet.service.interface.js";
import { verifyRedisConnection } from "../config/redis.js";

export class SnippetController {
	constructor(private readonly snippetService: ISnippetService) { }

	public create = async (
		req: Request<Record<string, never>, unknown, CreateSnippetInput>,
		res: Response<ApiSuccessResponse<{ id: string; expiresAt: number | null }>>,
		next: NextFunction
	): Promise<void> => {
		try {
			const result = await this.snippetService.createSnippet(req.body);
			res.status(201).json({
				success: true,
				data: result,
				timestamp: Date.now()
			});
		} catch (error) {
			next(error);
		}
	};

	public getById = async (
		req: Request<FetchSnippetParams>,
		res: Response<ApiSuccessResponse<SnippetResponse>>,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const passwordHeader = req.headers["x-snippet-password"];
			const password =
				typeof passwordHeader === "string"
					? passwordHeader
					: (req.query.password as string | undefined);

			const snippet = await this.snippetService.getSnippetById(id, password);
			res.status(200).json({
				success: true,
				data: snippet,
				timestamp: Date.now()
			});
		} catch (error) {
			next(error);
		}
	};

	public unlock = async (
		req: Request<FetchSnippetParams, unknown, UnlockSnippetInput>,
		res: Response<ApiSuccessResponse<SnippetResponse>>,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const snippet = await this.snippetService.unlockSnippet(id, req.body);
			res.status(200).json({
				success: true,
				data: snippet,
				timestamp: Date.now()
			});
		} catch (error) {
			next(error);
		}
	};

	public delete = async (
		req: Request<FetchSnippetParams>,
		res: Response<ApiSuccessResponse<{ id: string; deleted: boolean }>>,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const deleted = await this.snippetService.deleteSnippet(id);
			res.status(200).json({
				success: true,
				data: { id, deleted },
				timestamp: Date.now()
			});
		} catch (error) {
			next(error);
		}
	};

	public healthCheck = async (
		_req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const redisHealthy = await verifyRedisConnection();
			const status = redisHealthy ? 200 : 503;
			res.status(status).json({
				status: redisHealthy ? "healthy" : "degraded",
				redis: redisHealthy ? "connected" : "disconnected",
				uptime: process.uptime(),
				timestamp: Date.now()
			});
		} catch (error) {
			next(error);
		}
	};
}