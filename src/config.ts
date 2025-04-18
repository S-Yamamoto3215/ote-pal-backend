import * as dotenv from "dotenv";
import * as path from "path";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  app: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY as string,
    fromEmail: process.env.FROM_EMAIL as string,
  },
  token: {
    verificationExpiryHours: 1, // メール認証トークンの有効期限（時間）
    secret: process.env.TOKEN_SECRET,
  },
  jwt: {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    secret: process.env.JWT_SECRET as string,
  },
};
