import { Router } from "express";
import passport from "../../infrastructure/middleware/passport";
import {
  registerUser,
  logoutUser,
} from "../../infrastructure/controller/authController";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;
