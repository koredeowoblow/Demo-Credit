import db from "../database";
import { NotFoundError, ValidationError } from "../utils/responseHandler";
import { v4 as uuidv4 } from "uuid";

export class WalletService {
    static async getWalletByUserId(userId: string) {
        return db("wallets").where({ user_id: userId }).first();
    }

    static async fundAccount(userId: string, amount: number) {
        if (amount <= 0) throw new ValidationError("Amount must be positive");

        return db.transaction(async (trx) => {
            const wallet = await trx("wallets").where({ user_id: userId }).first();
            if (!wallet) throw new NotFoundError("Wallet not found");

            await trx("wallets")
                .where({ id: wallet.id })
                .update({ balance: Number(wallet.balance) + amount });

            await trx("transactions").insert({
                id: uuidv4(),
                wallet_id: wallet.id,
                type: "CREDIT",
                amount,
                reference: `FUND-${uuidv4()}`,
            });

            const updatedWallet = await trx("wallets").where({ id: wallet.id }).first();
            return updatedWallet;
        });
    }

    static async transferFunds(senderUserId: string, recipientEmail: string, amount: number) {
        if (amount <= 0) throw new ValidationError("Amount must be positive");

        return db.transaction(async (trx) => {
            const senderWallet = await trx("wallets").where({ user_id: senderUserId }).forUpdate().first();
            if (!senderWallet) throw new NotFoundError("Sender wallet not found");
            if (Number(senderWallet.balance) < amount) throw new ValidationError("Insufficient funds");

            const recipientUser = await trx("users").where({ email: recipientEmail }).first();
            if (!recipientUser) throw new NotFoundError("Recipient not found");
            if (recipientUser.id === senderUserId) throw new ValidationError("Cannot transfer to self");

            const recipientWallet = await trx("wallets").where({ user_id: recipientUser.id }).forUpdate().first();
            if (!recipientWallet) throw new NotFoundError("Recipient wallet not found");

            await trx("wallets").where({ id: senderWallet.id }).update({ balance: Number(senderWallet.balance) - amount });
            await trx("wallets").where({ id: recipientWallet.id }).update({ balance: Number(recipientWallet.balance) + amount });

            const reference = uuidv4();

            await trx("transactions").insert([
                {
                    id: uuidv4(),
                    wallet_id: senderWallet.id,
                    type: "DEBIT",
                    amount,
                    reference: `TRF-DEBIT-${reference}`,
                    counterparty_wallet_id: recipientWallet.id,
                },
                {
                    id: uuidv4(),
                    wallet_id: recipientWallet.id,
                    type: "CREDIT",
                    amount,
                    reference: `TRF-CREDIT-${reference}`,
                    counterparty_wallet_id: senderWallet.id,
                },
            ]);

            const updatedSender = await trx("wallets").where({ id: senderWallet.id }).first();
            const updatedRecipient = await trx("wallets").where({ id: recipientWallet.id }).first();

            return {
                message: "Transfer successful",
                reference,
                senderBalance: Number(updatedSender.balance),
                recipientBalance: Number(updatedRecipient.balance),
            };
        });
    }

    static async withdrawFunds(userId: string, amount: number) {
        if (amount <= 0) throw new ValidationError("Amount must be positive");

        return db.transaction(async (trx) => {
            const wallet = await trx("wallets").where({ user_id: userId }).forUpdate().first();
            if (!wallet) throw new NotFoundError("Wallet not found");
            if (Number(wallet.balance) < amount) throw new ValidationError("Insufficient funds");

            await trx("wallets").where({ id: wallet.id }).update({ balance: Number(wallet.balance) - amount });

            await trx("transactions").insert({
                id: uuidv4(),
                wallet_id: wallet.id,
                type: "DEBIT",
                amount,
                reference: `WTH-${uuidv4()}`,
            });

            const updatedWallet = await trx("wallets").where({ id: wallet.id }).first();
            return { message: "Withdrawal successful", newBalance: Number(updatedWallet.balance) };
        });
    }
}
