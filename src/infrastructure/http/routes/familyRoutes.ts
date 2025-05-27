import { Router } from "express";

import { FamilyControllerFactory } from "@/application/factories/Family/FamilyControllerFactory";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import { CreateFamilyDTO } from "@/interface/dto/Family/CreateFamilyDTO";
import { UpdateFamilyNameDTO } from "@/interface/dto/Family/UpdateFamilyNameDTO";
import { UpdateFamilyPaymentScheduleDTO } from "@/interface/dto/Family/UpdateFamilyPaymentScheduleDTO";

export const familyRouter = Router();
const familyController = FamilyControllerFactory.create();

familyRouter.post(
  "/new",
  validationMiddleware(CreateFamilyDTO),
  (req, res, next) => {
    familyController.createFamily(req, res, next);
  }
);

familyRouter.get("/:family_id", (req, res, next) => {
  familyController.getFamilyById(req, res, next);
});

familyRouter.put(
  "/:family_id/name",
  validationMiddleware(UpdateFamilyNameDTO),
  (req, res, next) => {
    familyController.updateFamilyName(req, res, next);
  }
);

familyRouter.put(
  "/:family_id/payment-schedule",
  validationMiddleware(UpdateFamilyPaymentScheduleDTO),
  (req, res, next) => {
    familyController.updateFamilyPaymentSchedule(req, res, next);
  }
);
