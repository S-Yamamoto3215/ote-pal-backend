import { Router } from "express";
import {
  findUser,
  findMyFamilyUsers,
  updateUser,
  deleteUser,
} from "../../infrastructure/controller/userController";

const router = Router();

router.get("/:id", findUser);
router.get("/:id/family-members", findMyFamilyUsers);
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
