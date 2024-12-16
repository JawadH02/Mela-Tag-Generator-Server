import { z } from "zod"

export const VariantSchema = z.object({
    id: z.number(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    inventory_quantity: z.number(),
    price: z.string(),
    compare_at_price: z.string().nullable().optional(),
    option1: z.string().nullable(),
    option2: z.string().nullable(),
    option3: z.string().nullable(),
})

export const ProductSchema = z.object({
    id: z.number(),
    title: z.string(),
    body_html: z.string(),
    handle: z.string(),
    vendor: z.string(),
    variants: z.array(VariantSchema),
})

export const GetProductsByVendorSchema = z.object({
    vendor: z.string().min(1, "Vendor is required"),
    startBarcode: z.string().optional(),
    endBarcode: z.string().optional(),
    limit: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional()
        .refine((val) => val === undefined || (val > 0 && val <= 250), {
            message: "Limit must be a positive number no greater than 250",
        }),
})

export type Variant = z.infer<typeof VariantSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type GetProductsByVendorInput = z.infer<typeof GetProductsByVendorSchema>