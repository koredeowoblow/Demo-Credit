import { Request, Response, NextFunction } from "express";
import { ResponseHandler, AppError } from "../utils/responseHandler";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log error for debugging
    console.error(err);

    // Delegate to ResponseHandler
    return ResponseHandler.error(res, err);
};
