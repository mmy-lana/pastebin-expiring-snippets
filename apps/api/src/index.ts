import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";
import { CreateSnippetSchema, SnippetResponse, ExpirationOptions } from "@pastebin/shared";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL || "",
	token: process.env.UPSTASH_REDIS_REST_TOKEN || ""
});

app.get("/healthz", (_, res) => {
	res.status(200).send("OK");
});

app.post("/api/snippets", async (req, res) => {
	try {
		const parseResult = CreateSnippetSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({ errors: parseResult.error.format() });
		}

		const { title, code, language, ttlSeconds } = parseResult.data;
		const id = nanoid(10);
		const now = Date.now();
		const isBurn = ttlSeconds === ExpirationOptions.BURN_AFTER_READ;

		const payload: SnippetResponse = {
			id,
			title: title || "Untitled",
			code,
			language,
			createdAt: now,
			expiresAt: isBurn ? null : now + ttlSeconds * 1000,
			burnAfterRead: isBurn
		};

		if (isBurn) {
			await redis.set(`snippet:${id}`, JSON.stringify(payload), { ex: 604800 }); // 7-day max fallback
		} else {
			await redis.set(`snippet:${id}`, JSON.stringify(payload), { ex: ttlSeconds });
		}

		res.status(201).json({ id });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/api/snippets/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const key = `snippet:${id}`;
		const raw = await redis.get<string | SnippetResponse>(key);

		if (!raw) {
			return res.status(404).json({ message: "Snippet not found or expired" });
		}

		const snippet: SnippetResponse = typeof raw === "string" ? JSON.parse(raw) : raw;

		if (snippet.burnAfterRead) {
			await redis.del(key);
		}

		res.json(snippet);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(port, () => console.log(`🚀 API listening on port ${port}`));