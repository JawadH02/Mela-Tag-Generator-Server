import { z } from "zod"

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    console.log("Loading environment variables with dotenv...");
    require("dotenv").config();
}

const EnvSchema = z.object({
    SHOPIFY_SHOP_NAME: z.string().min(1, "SHOPIFY_SHOP_NAME is required"),
    SHOPIFY_API_KEY: z.string().min(1, "SHOPIFY_API_KEY is required"),
    SHOPIFY_API_PASSWORD: z.string().min(1, "SHOPIFY_API_PASSWORD is required"),
    SERVER_PORT: z.string().optional().default("3000"), // Optional with default
});

const ProductFormatSchema = z.object({
    id: z.string(),
    barcode: z.string().optional(), 
    sku: z.string().optional(), 
    QRCodeUrl: z.string(), 
    title: z.string(), 
    description: z.string(), 
    variant1: z.string(), 
    variant2: z.string(), 
    variant3: z.string(), 
    vendor: z.string(), 
    price: z.string(), 
    compare_at_price: z.string().optional()
})

export type ProductFormat = z.infer<typeof ProductFormatSchema>;
export const env = EnvSchema.parse(process.env)