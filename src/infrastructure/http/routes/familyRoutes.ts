import { Router } from "express";

import { FamilyControllerFactory } from "@/application/factories/Family/FamilyControllerFactory";

export const familyRouter = Router();
const familyController = FamilyControllerFactory.create();

familyRouter.post("/new", (req, res, next) => {
  familyController.createFamily(req, res, next);
});

familyRouter.get("/:family_id", (req, res, next) => {
  familyController.getFamilyById(req, res, next);
});
