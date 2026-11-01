
import { z } from "zod";

export const bookQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  type: z.enum(["DIGITAL", "PHYSICAL", "BOTH"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const slugSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export type BookQuery = z.infer<typeof bookQuerySchema>;
