import { Request, Response } from "express";
import { AppDataSource } from "../database/ormconfig"
import { User } from "../../domain/entities/User";
import { validate } from "class-validator";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const newUser = new User();
  newUser.name = name;
  newUser.email = email;
  newUser.password = password;
  newUser.role = role;

  const errors = await validate(newUser);
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed" });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;

    await userRepository.save(newUser);
    res.status(201).json({ message: "User has been registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed" });
    }
    res.redirect('/');
  });
}
