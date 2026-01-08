import { verifyToken } from "../utils/jwt";
import { AuthenticationError } from "../utils/responseHandler";
export const authenticate = (req, res, next) => {
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
