import crypto from "node:crypto";
import { ExpirationOptions, SnippetRedisEntity } from "@pastebin/shared";
import { redis, verifyRedisConnection } from "../config/redis.js";
import { SnippetRepository } from "../repositories/snippet.repository.js";

async function seed() {
	console.log("⚡ [Seed] Initializing Upstash Redis test seed script...");

	const isHealthy = await verifyRedisConnection();
	if (!isHealthy) {
		console.error("❌ [Seed] Redis connection check failed. Aborting seeding.");
		process.exit(1);
	}

	const repository = new SnippetRepository(redis);
	const now = Date.now();

	const sampleSalt = crypto.randomBytes(16).toString("hex");
	const samplePasswordHash = crypto
		.pbkdf2Sync("secret123", sampleSalt, 10000, 64, "sha512")
		.toString("hex");

	const mockSnippets: Array<{ entity: SnippetRedisEntity; ttl: number }> = [
		{
			entity: {
				id: "demo-ts01",
				title: "TypeScript Binary Search Implementation",
				code: `export function binarySearch<T>(arr: T[], target: T): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
				language: "typescript",
				createdAt: now,
				expiresAt: now + ExpirationOptions.TWENTY_FOUR_HOURS * 1000,
				burnAfterRead: false,
				passwordHash: null,
				salt: null,
				maxViews: null,
				viewCount: 0
			},
			ttl: ExpirationOptions.TWENTY_FOUR_HOURS
		},
		{
			entity: {
				id: "demo-py02",
				title: "FastAPI JWT Verification Middleware",
				code: `from fastapi import Request, HTTPException\nimport jwt\n\nasync def verify_token(request: Request):\n    auth_header = request.headers.get("Authorization")\n    if not auth_header or not auth_header.startswith("Bearer "):\n        raise HTTPException(status_code=401, detail="Missing authorization header")\n    token = auth_header.split(" ")[1]\n    try:\n        return jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])\n    except jwt.PyJWTError:\n        raise HTTPException(status_code=401, detail="Invalid token")`,
				language: "python",
				createdAt: now,
				expiresAt: now + ExpirationOptions.SEVEN_DAYS * 1000,
				burnAfterRead: false,
				passwordHash: null,
				salt: null,
				maxViews: 50,
				viewCount: 12
			},
			ttl: ExpirationOptions.SEVEN_DAYS
		},
		{
			entity: {
				id: "demo-burn",
				title: "One-Time Production Database Secret",
				code: `DATABASE_URL="postgres://admin:x9K_ultra_secret_pass@db.internal:5432/prod_main"`,
				language: "bash",
				createdAt: now,
				expiresAt: null,
				burnAfterRead: true,
				passwordHash: null,
				salt: null,
				maxViews: 1,
				viewCount: 0
			},
			ttl: ExpirationOptions.BURN_AFTER_READ
		},
		{
			entity: {
				id: "demo-lock",
				title: "Encrypted Deployment Runbook (Password: secret123)",
				code: `#!/usr/bin/env bash\n# Step 1: Drain active node connections\nkubectl drain worker-01 --ignore-daemonsets --delete-emptydir-data\n# Step 2: Rollout new image deployment\nkubectl set image deployment/api-server api=ghcr.io/pastebin/api:v1.4.2`,
				language: "bash",
				createdAt: now,
				expiresAt: now + ExpirationOptions.THIRTY_DAYS * 1000,
				burnAfterRead: false,
				passwordHash: samplePasswordHash,
				salt: sampleSalt,
				maxViews: null,
				viewCount: 3
			},
			ttl: ExpirationOptions.THIRTY_DAYS
		}
	];

	for (const item of mockSnippets) {
		await repository.save(item.entity, item.ttl);
		console.log(`✔ [Seed] Seeded snippet: [${item.entity.id}] - ${item.entity.title}`);
	}

	console.log("🎉 [Seed] Successfully seeded all sample snippets!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("❌ [Seed] Unhandled error during seed:", err);
	process.exit(1);
});