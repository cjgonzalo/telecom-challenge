import { Schema, model } from "mongoose";
import { Employee } from "../controllers/employee.controller";

const employeeSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  legajo: { type: String, required: true, trim: true },
  dni: { type: String, required: true, trim: true },
  fecha_cumpleanios: { type: String, required: true, trim: true }, // TODO: maybe use Date?
  rol: { type: String, required: true, trim: true },
  dni_jefe: { type: String, trim: true },
  gerencia: { type: String, required: true, trim: true },
  sector: { type: String, required: true, trim: true }
})

employeeSchema.methods.getAge = (self: Employee): number => {
  const dateParts = self.fecha_cumpleanios.split("/")
  return new Date().getFullYear() - Number(dateParts[2])
}

module.exports = model("EmployeeSchema", employeeSchema)