import dotenv from "dotenv";

dotenv.config();

export const ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";

