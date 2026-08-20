import { customAlphabet } from "nanoid";
import { SNIPPET_LIMITS } from "@pastebin/shared";

// URL-friendly alphanumeric alphabet without easily confused characters
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

const nanoid = customAlphabet(ALPHABET, SNIPPET_LIMITS.ID_LENGTH);

export function generateSnippetId(): string {
	return nanoid();
}