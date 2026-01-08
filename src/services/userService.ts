import db from "../database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { KarmaService } from "./karmaService";
import { AppError, ConflictError, AuthorizationError, AuthenticationError } from "../utils/responseHandler";

export class UserService {
    static async registerUser(data: any) {
        const { name, email, password } = data;

        // 1. Check if user already exists
        const existingUser = await db("users").where({ email }).first();
        if (existingUser) {
            throw new ConflictError("User already exists");
        }

        // 2. Check Karma Blacklist
        const blacklisted = await KarmaService.isBlacklisted(email);
        if (blacklisted) {
            throw new AuthorizationError("User is unable to be onboarded");
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User and Wallet in transaction
        const trx = await db.transaction();

        try {
            const userId = uuidv4();
            await trx("users").insert({
                id: userId,
                name,
                email,
                password: hashedPassword,
            });

            // Fetch back or just use the ID we generated. We use ID.
            // Confirming user was inserted is implicit if no error.

            await trx("wallets").insert({
                id: uuidv4(),
                user_id: userId,
                balance: 0,
                currency: "NGN",
            });

            await trx.commit();

            // Return the user object
            return { id: userId, name, email };
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    static async loginUser(data: any) {
        // Basic login for testing.
        const { email, password } = data;
        const user = await db("users").where({ email }).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AuthenticationError("Invalid credentials");
        }
        return user;
    }
}
