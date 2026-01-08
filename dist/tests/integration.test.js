import request from "supertest";
import app from "../src/app";
import db from "../src/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
describe("Integration Tests", () => {
    let token;
    let userId;
    const userEmail = "integration@example.com";
    const userPassword = "password123";
    beforeEach(async () => {
        // Seed a user and wallet for tests that need it
        const hashed = await bcrypt.hash(userPassword, 10);
        userId = uuidv4();
        await db("users").insert({
            id: userId,
            name: "Integration User",
            email: userEmail,
            password: hashed
        });
        await db("wallets").insert({
            id: uuidv4(),
            user_id: userId,
            balance: 0,
            currency: "NGN"
        });
        // pre-generate token for convenience
        const res = await request(app).post("/api/v1/users/login").send({
            email: userEmail,
            password: userPassword
        });
        token = res.body.data.token;
    });
    test("should register a new user", async () => {
        // Use a different email to avoid conflict with seeded user
        const newEmail = "new_integration@example.com";
        const res = await request(app).post("/api/v1/users/register").send({
            name: "New Integration User",
            email: newEmail,
            password: "password123",
        });
        expect(res.status).toBe(201);
        expect(res.body.data.user.email).toBe(newEmail);
        expect(res.body.data.token).toBeDefined();
        // Use View Wallet to verify wallet auto-creation logic if we wanted, 
        // but checking the response or DB is enough.
        const userWallet = await db("wallets").where({ user_id: res.body.data.user.id }).first();
        expect(userWallet).toBeDefined();
    });
    test("should login a user", async () => {
        // Login the seeded user
        const res = await request(app).post("/api/v1/users/login").send({
            email: userEmail,
            password: userPassword
        });
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
    });
    test("should get wallet details", async () => {
        const res = await request(app)
            .get("/api/v1/wallets")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.balance).toBeDefined();
    });
    test("should fund wallet", async () => {
        const res = await request(app)
            .post("/api/v1/wallets/fund")
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 5000 });
        expect(res.status).toBe(200);
        // Assert balance update
        expect(Number(res.body.data.balance)).toBe(5000);
    });
    test("should withdraw from wallet", async () => {
        // First fund it implicitly or explicitly
        await db("wallets").where({ user_id: userId }).update({ balance: 5000 });
        const res = await request(app)
            .post("/api/v1/wallets/withdraw")
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 1000 });
        expect(res.status).toBe(200);
        expect(res.body.data.newBalance).toBe(4000);
    });
});
