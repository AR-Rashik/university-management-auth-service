import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";
const router = express.Router();

router.get("/:id", AdminController.getSingleAdmin); // get single admin
router.get("/", AdminController.getAllAdmins); // get all admins

router.delete("/:id", AdminController.deleteAdmin); // delete admin

router.patch(
  "/:id",
  validateRequest(AdminValidation.updateAdmin), // update admin
  AdminController.updateAdmin
);

export const AdminRoutes = router;
