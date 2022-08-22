import { Router } from "express";
import { 
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  getEmployeeByFileNumber,
  updateEmployee,
  sendEmployeeInfo
} from "../controllers/employee.controller";

const router = Router()

router.route("/")
  .get(getEmployees)
  .post(createEmployee)

router.route("/:id")
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee)

router.route("/info/:id")
  .post(sendEmployeeInfo)

export default router