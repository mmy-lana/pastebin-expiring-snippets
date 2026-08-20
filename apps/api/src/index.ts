import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { redis } from "./config/redis.js";
import { SnippetRepository } from "./repositories/snippet.repository.js";
import { SnippetService } from "./services/snippet.service.js";
import { createAppRouter } from "./routes/index.js";
import { errorHandler, AppError } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(
	helmet({
		contentSecurityPolicy: false
	})
);
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "*",
		methods: ["GET", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "x-snippet-password"]
	})
);
app.use(express.json({ limit: "1mb" }));

// Dependency Injection Composition Root
const snippetRepository = new SnippetRepository(redis);
const snippetService = new SnippetService(snippetRepository);
const appRouter = createAppRouter(snippetService);

app.use(appRouter);

// 404 handler for undefined routes
app.use((_req, _res, next) => {
	next(new AppError("Requested resource or route was not found", 404, "ROUTE_NOT_FOUND"));
});

// Centralized error middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`🚀 [API] Pastebin microservice listening on port ${port}`);
});

export default app;