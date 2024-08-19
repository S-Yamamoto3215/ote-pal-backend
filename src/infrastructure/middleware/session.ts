import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

export default session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: true,
});
