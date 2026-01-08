import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "default_secret";
export const signToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
