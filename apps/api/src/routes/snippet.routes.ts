import { Router } from "express";
import {
	CreateSnippetSchema,
	FetchSnippetParamsSchema,
	UnlockSnippetSchema
} from "@pastebin/shared";
import { SnippetController } from "../controllers/snippet.controller.js";
import {
	validateBody,
	validateParams
} from "../middleware/validate.middleware.js";
import { createRateLimiter } from "../middleware/rate-limiter.middleware.js";

export function createSnippetRouter(snippetController: SnippetController): Router {
	const router = Router();

	// Rate limiters per operation
	const createLimiter = createRateLimiter({
		windowSeconds: 60,
		maxRequests: 30,
		keyPrefix: "create-snippet"
	});

	const readLimiter = createRateLimiter({
		windowSeconds: 60,
		maxRequests: 120,
		keyPrefix: "read-snippet"
	});

	const unlockLimiter = createRateLimiter({
		windowSeconds: 60,
		maxRequests: 15,
		keyPrefix: "unlock-snippet"
	});

	router.post(
		"/",
		createLimiter,
		validateBody(CreateSnippetSchema),
		snippetController.create
	);

	router.get(
		"/:id",
		readLimiter,
		validateParams(FetchSnippetParamsSchema),
		snippetController.getById
	);

	router.post(
		"/:id/unlock",
		unlockLimiter,
		validateParams(FetchSnippetParamsSchema),
		validateBody(UnlockSnippetSchema),
		snippetController.unlock
	);

	router.delete(
		"/:id",
		validateParams(FetchSnippetParamsSchema),
		snippetController.delete
	);

	return router;
}