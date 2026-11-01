
import { z } from "zod";

const checkoutItemSchema = z.object({
  bookId: z.string().trim().min(1, "Book ID is required"),
  format: z.enum(["DIGITAL", "PHYSICAL"]),
  quantity: z.coerce.number().int().min(1).max(10),
}).strict();

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(20),

  recipientName: z.string().trim().min(2).max(100).optional(),
  recipientPhone: z.string().trim().min(7).max(25).optional(),
  deliveryAddress: z.string().trim().min(5).max(300).optional(),
  deliveryCity: z.string().trim().min(2).max(100).optional(),
  deliveryRegion: z.string().trim().min(2).max(100).optional(),
  deliveryNotes: z.string().trim().max(500).optional(),
}).strict().superRefine((data, ctx) => {
  const ids = data.items.map((item) => item.bookId);

  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({
      code: "custom",
      path: ["items"],
      message: "Each book must appear only once. Combine duplicate quantities.",
    });
  }

  const requiresDelivery = data.items.some(
    (item) => item.format === "PHYSICAL",
  );

  if (requiresDelivery) {
    const requiredFields = [
      ["recipientName", data.recipientName],
      ["recipientPhone", data.recipientPhone],
      ["deliveryAddress", data.deliveryAddress],
      ["deliveryCity", data.deliveryCity],
      ["deliveryRegion", data.deliveryRegion],
    ] as const;

    for (const [field, value] of requiredFields) {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: `${field} is required for physical book delivery`,
        });
      }
    }
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
