import { ResponseHandler } from "../utils/responseHandler";
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err);
    // Delegate to ResponseHandler
    return ResponseHandler.error(res, err);
};
