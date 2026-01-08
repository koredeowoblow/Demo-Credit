import { WalletService } from "../services/walletService";
import { ResponseHandler } from "../utils/responseHandler";
export class WalletController {
    constructor() {
        this.getWallet = async (req, res, next) => {
            const userId = req.user.id;
            const wallet = await WalletService.getWalletByUserId(userId);
            return ResponseHandler.success(res, wallet, "Wallet retrieved successfully");
        };
        this.fund = async (req, res, next) => {
            const userId = req.user.id;
            const { amount } = req.body;
            const wallet = await WalletService.fundAccount(userId, Number(amount));
            return ResponseHandler.success(res, wallet, "Account funded successfully");
        };
        this.transfer = async (req, res, next) => {
            const userId = req.user.id;
            const { email, amount } = req.body;
            const result = await WalletService.transferFunds(userId, email, Number(amount));
            return ResponseHandler.success(res, result, "Transfer successful");
        };
        this.withdraw = async (req, res, next) => {
            const userId = req.user.id;
            const { amount } = req.body;
            const result = await WalletService.withdrawFunds(userId, Number(amount));
            return ResponseHandler.success(res, result, "Withdrawal successful");
        };
    }
}
