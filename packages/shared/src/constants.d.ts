export declare const SUPPORTED_LANGUAGES: readonly ["plaintext", "typescript", "javascript", "python", "rust", "go", "c", "cpp", "csharp", "java", "html", "css", "json", "yaml", "markdown", "sql", "bash", "dockerfile"];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export declare const ExpirationOptions: {
    readonly BURN_AFTER_READ: 0;
    readonly FIVE_MINUTES: 300;
    readonly TEN_MINUTES: 600;
    readonly ONE_HOUR: 3600;
    readonly TWENTY_FOUR_HOURS: 86400;
    readonly SEVEN_DAYS: 604800;
    readonly THIRTY_DAYS: 2592000;
};
export type ExpirationPreset = (typeof ExpirationOptions)[keyof typeof ExpirationOptions];
export declare const SNIPPET_LIMITS: {
    readonly TITLE_MAX_LENGTH: 100;
    readonly CONTENT_MIN_LENGTH: 1;
    readonly CONTENT_MAX_LENGTH: 500000;
    readonly PASSWORD_MIN_LENGTH: 1;
    readonly PASSWORD_MAX_LENGTH: 64;
    readonly MAX_VIEWS_LIMIT: 10000;
    readonly ID_LENGTH: 10;
    readonly BURN_FALLBACK_TTL_SECONDS: 604800;
};
export declare const REDIS_KEYS: {
    readonly SNIPPET_PREFIX: "snippet:";
    readonly VIEW_COUNTER_PREFIX: "snippet:views:";
    readonly RATE_LIMIT_PREFIX: "ratelimit:";
};
