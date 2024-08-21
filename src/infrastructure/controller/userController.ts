import { Request, Response } from "express";

import { User } from "../../domain/entities/User";
import { UserError } from "../../domain/errors/UserError";
import { UserService } from "../../domain/services/UserService";

const userService = new UserService();

export const findUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userService.findUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserError) {
      return res
        .status(error.getStatusCode())
        .json({ message: error.getErrorMessage() });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const findUsersByFamilyID = async (req: Request, res: Response) => {
  const { familyID } = req.params;

  try {
    const users = await userService.findUsersByFamilyID(familyID);
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof UserError) {
      return res
        .status(error.getStatusCode())
        .json({ message: error.getErrorMessage() });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const user = new User();
  user.id = id;
  user.name = name;
  user.email = email;
  user.password = password;
  user.role = role;

  try {
    await userService.updateUser(user);
    res.status(200).json({ message: "User has been updated" });
  } catch (error) {
    if (error instanceof UserError) {
      return res
        .status(error.getStatusCode())
        .json({ message: error.getErrorMessage() });
    }
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userService.findUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await userService.deleteUser(user);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    if (error instanceof UserError) {
      return res
        .status(error.getStatusCode())
        .json({ message: error.getErrorMessage() });
    }
    res.status(500).json({ message: "Server error" });
  }
};
