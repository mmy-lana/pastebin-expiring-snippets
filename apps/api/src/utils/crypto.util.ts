import crypto from "node:crypto";

const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): { hash: string; salt: string } {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST)
		.toString("hex");
	return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
	const derivedHash = crypto
		.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST)
		.toString("hex");

	const bufferA = Buffer.from(hash, "hex");
	const bufferB = Buffer.from(derivedHash, "hex");

	if (bufferA.length !== bufferB.length) {
		return false;
	}

	return crypto.timingSafeEqual(bufferA, bufferB);
}