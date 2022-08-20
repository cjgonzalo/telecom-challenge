import { Router } from "express";
import { 
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees, 
  updateEmployee
} from "../controllers/employee.controller";

const router = Router()

router.route("/")
  .get(getEmployees)
  .post(createEmployee)

router.route("/:id")
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee)

export default router