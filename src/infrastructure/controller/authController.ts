import { Request, Response } from "express";

import { User } from "../../domain/entities/User";
import { UserError } from "../../domain/errors/UserError";
import { UserService } from "../../domain/services/UserService";

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const newUser = new User();
  newUser.name = name;
  newUser.email = email;
  newUser.password = password;
  newUser.role = role;

  try {
    await userService.registerUser(newUser);
    res.status(201).json({ message: "User has been registered" });
  } catch (error) {
    if (error instanceof UserError) {
      return res
        .status(error.getStatusCode())
        .json({ message: error.getErrorMessage() });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("/");
  });
};
