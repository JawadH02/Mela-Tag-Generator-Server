import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({ ...req.params, ...req.query, ...req.body })
            next()
        } catch (e) {
            res.status(400).json({ error: (e as any).errors });
        }
    }
}