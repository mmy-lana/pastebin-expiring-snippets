import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			req.body = await schema.parseAsync(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				next(error);
			} else {
				next(error);
			}
		}
	};
}

export function validateParams<T>(schema: ZodSchema<T>) {
	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			req.params = (await schema.parseAsync(req.params)) as unknown as Record<string, string>;
			next();
		} catch (error) {
			next(error);
		}
	};
}

export function validateQuery<T>(schema: ZodSchema<T>) {
	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			req.query = (await schema.parseAsync(req.query)) as unknown as Request["query"];
			next();
		} catch (error) {
			next(error);
		}
	};
}