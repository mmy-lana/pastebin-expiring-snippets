export const SUPPORTED_LANGUAGES = [
	"plaintext",
	"typescript",
	"javascript",
	"python",
	"rust",
	"go",
	"c",
	"cpp",
	"csharp",
	"java",
	"html",
	"css",
	"json",
	"yaml",
	"markdown",
	"sql",
	"bash",
	"dockerfile"
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const ExpirationOptions = {
	BURN_AFTER_READ: 0,
	FIVE_MINUTES: 300,
	TEN_MINUTES: 600,
	ONE_HOUR: 3600,
	TWENTY_FOUR_HOURS: 86400,
	SEVEN_DAYS: 604800,
	THIRTY_DAYS: 2592000
} as const;

export type ExpirationPreset = (typeof ExpirationOptions)[keyof typeof ExpirationOptions];

export const SNIPPET_LIMITS = {
	TITLE_MAX_LENGTH: 100,
	CONTENT_MIN_LENGTH: 1,
	CONTENT_MAX_LENGTH: 500000, // 500 KB limit for payload size
	PASSWORD_MIN_LENGTH: 4,
	PASSWORD_MAX_LENGTH: 64,
	MAX_VIEWS_LIMIT: 10000,
	ID_LENGTH: 10,
	BURN_FALLBACK_TTL_SECONDS: 604800 // 7 days safety eviction for unread burn snippets
} as const;

export const REDIS_KEYS = {
	SNIPPET_PREFIX: "snippet:",
	VIEW_COUNTER_PREFIX: "snippet:views:",
	RATE_LIMIT_PREFIX: "ratelimit:"
} as const;