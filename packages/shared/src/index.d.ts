import { z } from "zod";
export declare const ExpirationOptions: {
    readonly TEN_MINUTES: 600;
    readonly ONE_HOUR: 3600;
    readonly TWENTY_FOUR_HOURS: 86400;
    readonly SEVEN_DAYS: 604800;
    readonly BURN_AFTER_READ: 0;
};
export declare const CreateSnippetSchema: z.ZodObject<{
    title: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    code: z.ZodString;
    language: z.ZodDefault<z.ZodString>;
    ttlSeconds: z.ZodDefault<z.ZodEnum<{
        readonly TEN_MINUTES: 600;
        readonly ONE_HOUR: 3600;
        readonly TWENTY_FOUR_HOURS: 86400;
        readonly SEVEN_DAYS: 604800;
        readonly BURN_AFTER_READ: 0;
    }>>;
}, z.core.$strip>;
export type CreateSnippetInput = z.infer<typeof CreateSnippetSchema>;
export interface SnippetResponse {
    id: string;
    title: string;
    code: string;
    language: string;
    createdAt: number;
    expiresAt: number | null;
    burnAfterRead: boolean;
}
