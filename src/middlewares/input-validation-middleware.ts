import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ message: result.mapped() });
    return;
  }
  next();
};
