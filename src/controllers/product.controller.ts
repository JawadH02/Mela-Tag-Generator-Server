import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";
import { fetchProductsByVendor, processProducts } from "../services/shopifyService";


const getProductsByVendor = async(req: Request, res: Response, next: NextFunction) => {

    try {
        // const { vendor } = req.params
        const { vendor, startBarcode, endBarcode } = req.body
        
        const products: Product[] = await fetchProductsByVendor(vendor, startBarcode as string, endBarcode as string)
        const processedProducts = processProducts(products);
        
        res.json(processedProducts)
    } catch (e) {
        next(e)
    }
}

export { getProductsByVendor }