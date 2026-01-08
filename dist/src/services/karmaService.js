import axios from "axios";
// import { AppError } from "../utils/responseHandler"; // Not strictly used here yet as we return boolean
const KARMA_URL = process.env.LENDSQR_ADJUTOR_URL || "https://adjutor.lendsqr.com/v2";
const KARMA_KEY = process.env.LENDSQR_ADJUTOR_KEY;
export class KarmaService {
    static async isBlacklisted(identity) {
        // If we don't have a real key or want to mock it (e.g. for testing without hitting external API)
        if (process.env.NODE_ENV === "test" || KARMA_KEY === "mock_key") {
            // Mock behavior: "baduser@example.com" is blacklisted
            return identity === "baduser@example.com";
        }
        const response = await axios.get(`${KARMA_URL}/verification/karma/${identity}`, {
            headers: {
                Authorization: `Bearer ${KARMA_KEY}`,
            },
        });
        console.log(response.data);
        if (response.data && response.data.status === "success" && response.data.data) {
            if (response.data.data.amount_in_contention > 0) {
                return true;
            }
        }
        console.log(`${identity} is not blacklisted`);
        return false;
    }
}
