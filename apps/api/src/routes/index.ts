import { Router } from "express";
import { ISnippetService } from "../services/interfaces/snippet.service.interface.js";
import { SnippetController } from "../controllers/snippet.controller.js";
import { createSnippetRouter } from "./snippet.routes.js";
import openApiSpec from "../docs/openapi.json" with { type: "json" };

export function createAppRouter(snippetService: ISnippetService): Router {
	const router = Router();
	const snippetController = new SnippetController(snippetService);

	router.get("/healthz", snippetController.healthCheck);
	router.get("/openapi.json", (_req, res) => {
		res.json(openApiSpec);
	});

	router.use("/api/snippets", createSnippetRouter(snippetController));

	return router;
}