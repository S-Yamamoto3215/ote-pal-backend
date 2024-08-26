import { Router } from "express";
import passport from "passport";

import {
  registerUser,
  logoutUser,
} from "../../infrastructure/controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/logout", logoutUser);

export default router;
