import { WalletService } from "../src/services/walletService";
import db from "../src/database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

describe("Wallet Service Tests", () => {
    let user1: any;
    let user2: any;

    beforeEach(async () => {
        // Clear tables to avoid leftover data
        await db("transactions").del();
        await db("wallets").del();
        await db("users").del();

        const id1 = uuidv4();
        const id2 = uuidv4();
        const hashed = await bcrypt.hash("password123", 10);

        // Insert test users
        await db("users").insert([
            { id: id1, name: "User One", email: "user1@example.com", password: hashed },
            { id: id2, name: "User Two", email: "user2@example.com", password: hashed },
        ]);

        const walletId1 = uuidv4();
        const walletId2 = uuidv4();

        // Create wallets with 0 balance initially
        await db("wallets").insert([
            { id: walletId1, user_id: id1, balance: 0, currency: "NGN" },
            { id: walletId2, user_id: id2, balance: 0, currency: "NGN" },
        ]);

        user1 = await db("users").where({ id: id1 }).first();
        user2 = await db("users").where({ id: id2 }).first();
    });

    test("should fund account successfully", async () => {
        const wallet = await WalletService.fundAccount(user1.id, 5000);

        // Ensure wallet balance
        expect(Number(wallet.balance)).toBe(5000);

        // Ensure transaction created
        const tx = await db("transactions").where({
            wallet_id: wallet.id,
            type: "CREDIT",
        }).first();

        expect(tx).toBeDefined();
        expect(Number(tx.amount)).toBe(5000);
    });

    test("should transfer funds successfully", async () => {
        // Fund sender wallet first
        await WalletService.fundAccount(user1.id, 10000);

        const result = await WalletService.transferFunds(user1.id, user2.email, 3000);
        expect(result.message).toBe("Transfer successful");

        const senderWallet = await WalletService.getWalletByUserId(user1.id);
        const recipientWallet = await WalletService.getWalletByUserId(user2.id);

        expect(Number(senderWallet.balance)).toBe(7000); // 10000 - 3000
        expect(Number(recipientWallet.balance)).toBe(3000); // 0 + 3000
    });

    test("should fail transfer if insufficient funds", async () => {
        await expect(
            WalletService.transferFunds(user1.id, user2.email, 5000)
        ).rejects.toThrow("Insufficient funds");
    });

    test("should withdraw funds successfully", async () => {
        await WalletService.fundAccount(user1.id, 5000);
        const result = await WalletService.withdrawFunds(user1.id, 2000);

        expect(result.newBalance).toBe(3000);

        const wallet = await WalletService.getWalletByUserId(user1.id);
        expect(Number(wallet.balance)).toBe(3000);
    });
});
