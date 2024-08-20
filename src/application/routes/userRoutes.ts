import { Router } from "express";
import {
  findUser,
  findUsersByFamilyID,
  updateUser,
  deleteUser,
} from "../../infrastructure/controller/userController";

const router = Router();

router.get("/:id", findUser);
router.get("/family/:familyID", findUsersByFamilyID);
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
