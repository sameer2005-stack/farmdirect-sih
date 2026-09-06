import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export default function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: result.error.issues,
      });
    }

    next();
  };
}