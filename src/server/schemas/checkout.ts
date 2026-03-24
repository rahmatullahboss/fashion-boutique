import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
        image: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1, "Cart must have at least one item"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
