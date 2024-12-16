import { Router } from "express";
import getProductRoutes from "./product.route";

const router = Router()

router.use("/products", getProductRoutes)

export default router