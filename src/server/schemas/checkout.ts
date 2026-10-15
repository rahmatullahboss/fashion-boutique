import { z } from "zod";

/** Client identifies only a real catalog variant; price/name come from the server. */
export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    size: z.string().trim().min(1).max(64),
    color: z.string().trim().min(1).max(64),
    quantity: z.number().int().min(1).max(10),
  }).strict()).min(1).max(20),
  customerEmail: z.email().max(254).optional(),
}).strict();

export type CheckoutInput = z.infer<typeof checkoutSchema>;
