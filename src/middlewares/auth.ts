import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthenticationError } from "../utils/responseHandler";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AuthenticationError("Unauthorized"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return next(new AuthenticationError("Invalid or expired token"));
    }

    req.user = decoded;
    next();
};
