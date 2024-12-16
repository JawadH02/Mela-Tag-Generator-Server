import { env, ProductFormat } from "./config";
import Shopify from "shopify-api-node";
import { Product } from "../models/product.model";
import { stripHtmlTags } from "../utils/stripHTMLTags";
import { v6 as uuidv6 } from "uuid"


const shopify = new Shopify({
    shopName: env.SHOPIFY_SHOP_NAME,
    apiKey: env.SHOPIFY_API_KEY,
    password: env.SHOPIFY_API_PASSWORD
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProductsByVendor = async (
    vendor: string,
    startBarcode?: string,
    endBarcode?: string,
    limit = 250
): Promise<Product[]> => {
    let products: Product[] = [];
    let pageProducts: Product[] = [];
    let sinceId = 0;

    do {
        try {
            pageProducts = await shopify.product.list({ vendor, limit, since_id: sinceId });

            pageProducts = pageProducts.sort((a, b) => {
                const barcodeA = parseInt(a.variants[0]?.barcode || "0", 10);
                const barcodeB = parseInt(b.variants[0]?.barcode || "0", 10);
                return barcodeA - barcodeB;
            });

            products.push(...pageProducts);
            sinceId = pageProducts[pageProducts.length - 1]?.id || 0;

            // Throttle requests to avoid hitting the rate limit
            await delay(500); // 500ms delay
        } catch (error: any) {
            if (error.statusCode === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '2', 10) * 1000;
                console.error(`Rate limit exceeded, retrying after ${retryAfter}ms...`);
                await delay(retryAfter);
            } else {
                throw error; // Throw unexpected errors
            }
        }
    } while (pageProducts.length > 0);

    // Filter products globally by barcode range
    if (startBarcode || endBarcode) {
        products = products.filter(product =>
            product.variants.some(variant => {
                const barcode = variant.barcode ? parseInt(variant.barcode, 10) : NaN;
                return (!isNaN(barcode)) &&
                       (!startBarcode || barcode >= parseInt(startBarcode, 10)) &&
                       (!endBarcode || barcode <= parseInt(endBarcode, 10));
            })
        );
    }

    return products;
};

export const processProducts = (products: Product[]): ProductFormat[] => {
    const lines: string[] = []

    const productObj: ProductFormat[] = []

    for (const product of products) {
        const description: string = stripHtmlTags(product.body_html)
            .replace(/\s{2,}/g, " ")
            .trim();

        const title: string = product.title
            .replace(/\s{2,}/g, " ")
            .trim();

        // Iterate over variants
        for (const variant of product.variants) {
            const variant1: string = variant.option1 || ""
            const variant2: string = variant.option2 || ""
            const variant3: string = variant.option3 || ""
            const quantity: number = variant.inventory_quantity

            // Duplicate lines based on quantity
            for (let i = 0; i < (quantity > 1 ? quantity : 1); i++) {

                productObj.push({
                    id: uuidv6(),
                    barcode: variant.barcode || "",
                    sku: variant.sku || "",
                    QRCodeUrl: `https://melashops.com/products/${product.handle}/?variant=${variant.id}`,
                    title,
                    description,
                    variant1,
                    variant2,
                    variant3,
                    vendor: product.vendor,
                    price: variant.price,
                    compare_at_price: variant.compare_at_price || ""
                })
            }
        }
    }

    return productObj.sort();
}