import { Router } from "express";
import { getProductsByVendor } from "../controllers/product.controller";
import { validateQuery } from "../middlewares/validate.middleware";
import { GetProductsByVendorSchema } from "../models/product.model";


const router = Router()

router.post("/vendor", validateQuery(GetProductsByVendorSchema), getProductsByVendor)

 
export default router