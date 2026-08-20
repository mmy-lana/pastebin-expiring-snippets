import { Request, Response, NextFunction } from "express";
import { REDIS_KEYS } from "@pastebin/shared";
import { redis } from "../config/redis.js";
import { AppError } from "./error.middleware.js";

interface RateLimiterOptions {
	windowSeconds: number;
	maxRequests: number;
	keyPrefix?: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
	const { windowSeconds, maxRequests, keyPrefix = "general" } = options;

	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			const forwarded = req.headers["x-forwarded-for"];
			const ip =
				(typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : null) ||
				req.ip ||
				req.socket.remoteAddress ||
				"unknown-client";

			const redisKey = `${REDIS_KEYS.RATE_LIMIT_PREFIX}${keyPrefix}:${ip}`;

			const currentCount = await redis.incr(redisKey);

			if (currentCount === 1) {
				await redis.expire(redisKey, windowSeconds);
			}

			if (currentCount > maxRequests) {
				const ttl = await redis.ttl(redisKey);
				throw new AppError(
					`Too many requests. Please try again in ${ttl > 0 ? ttl : windowSeconds} seconds.`,
					429,
					"RATE_LIMIT_EXCEEDED",
					{ retryAfterSeconds: ttl > 0 ? ttl : windowSeconds }
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}