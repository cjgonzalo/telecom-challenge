import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  legajo: { type: String, required: true, trim: true },
  dni: { type: Number, required: true },
  fecha_cumpleanios: { type: String, required: true, trim: true },
  rol: { type: String, required: true, trim: true },
  dni_jefe: { type: Number },
  gerencia: { type: String, required: true, trim: true },
  sector: { type: String, required: true, trim: true }
}, { collection: "employee" })

// Método que devuelve la edad del empleado solicitado
employeeSchema.methods.getAge = function(): number {
  const dateParts = this.fecha_cumpleanios.split("/")
  const now = new Date()
  if( // todavía no cumplió años
    now.getMonth() < Number(dateParts[1]) ||
    now.getMonth() === Number(dateParts[1]) && now.getDay() < Number(dateParts[0])
  ) {
    return now.getFullYear() - Number(dateParts[2]) - 1
  } else { // ya cumplió años este año
    return now.getFullYear() - Number(dateParts[2])
  }
}

// Método que devuelve los empleados que tienen como jefe inmediato al empleado solicitado
employeeSchema.methods.getImmediateDependents = async function() {
  try {
    return await model("EmployeeSchema", employeeSchema).find({
      dni_jefe: this.dni
    })
    .then(dependents => dependents)
    .catch(error => { throw error })

  } catch(error: any) {
    throw error
  }

}

module.exports = model("EmployeeSchema", employeeSchema)