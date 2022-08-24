import { Router } from "express";
import { 
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeByFileNumber,
  getEmployees,
  updateEmployee,
  sendEmployeeInfo
} from "../controllers/employee.controller";

const router = Router()

router.route("/")
  .get(getEmployees)
  .post(createEmployee)

router.route("/:filter")
  .get(getEmployee, getEmployeeByFileNumber)
  .put(updateEmployee)
  .delete(deleteEmployee)

router.route("/info/:id")
  .post(sendEmployeeInfo)

export default router