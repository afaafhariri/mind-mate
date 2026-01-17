import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

export const generateToken = (userId: string, email: string) => {
    return jwt.sign({id: userId, email}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN as any});
};