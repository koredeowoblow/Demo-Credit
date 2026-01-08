import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import { WalletService } from "../services/walletService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export class WalletController {
    getWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user!.id;
        const wallet = await WalletService.getWalletByUserId(userId);
        return ResponseHandler.success(res, wallet, "Wallet retrieved successfully");
    };

    fund = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user!.id;
        const { amount } = req.body;
        const wallet = await WalletService.fundAccount(userId, Number(amount));
        return ResponseHandler.success(res, wallet, "Account funded successfully");
    };

    transfer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user!.id;
        const { email, amount } = req.body;
        const result = await WalletService.transferFunds(userId, email, Number(amount));
        return ResponseHandler.success(res, result, "Transfer successful");
    };

    withdraw = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user!.id;
        const { amount } = req.body;
        const result = await WalletService.withdrawFunds(userId, Number(amount));
        return ResponseHandler.success(res, result, "Withdrawal successful");
    };
}
