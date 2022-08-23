import { Request, Response, NextFunction } from "express"
import { EmployeeError } from "../errors/employee.error"
import { removeFile, writeFile } from "../helpers/file-writer"
import { Email, sendEmail } from "../helpers/mail-sender.helper"
import { getAllDependents } from "../helpers/employee.helper"

const EmployeeModel = require("../models/employee.model")

// Interfaz empleado que respeta EmployeeSchema
export interface Employee {
  nombre: string,
  apellido: string,
  legajo: string,
  dni: Number,
  fecha_cumpleanios: string,
  rol: string,
  dni_jefe?: Number,
  gerencia: string,
  sector: string,

  getAge(): number
  getImmediateDependents(): Array<Employee>
}

// Returns all the existing employees
export const getEmployees = async (_req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    return await EmployeeModel.find()
      .then((employees: Array<Employee>) => {
        if(employees.length === 0) {
          throw new EmployeeError(404, "No employees found!")
        }
        return res.status(200).json(employees)
      })
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const getEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    return await EmployeeModel.findById(req.params.id)
      .then((employee: Employee) => {
        if(!employee) {
          throw new EmployeeError(404, `No employee found with id ${req.params.id}`)
        }
        return res.status(200).json(employee)
      })
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try{
    const employeeFields = req.body as Employee
    const employee = new EmployeeModel(employeeFields)

    return await employee.save()
      .then((newEmployee: Employee) => res.status(200).json(newEmployee))
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    const employeeFields = req.body as Employee

    return await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      employeeFields
    )
    .then((updatedEmployee: Employee) => res.status(200).json(updatedEmployee))
    .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    return await EmployeeModel.findOneAndDelete({
      _id: req.params.id
    })
    .then((deletedEmployee: Employee) => res.status(200).json(deletedEmployee))
  } catch(error: any) {
    next(error)
  }
}

export const sendEmployeeInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    const employee = await EmployeeModel.findById(req.params.id)
    const dependents = await getAllDependents(employee, []) // El acumulador empieza como un array vacío

    const xlsxPath = writeFile(employee, dependents)

    // TODO: usar mail real
    const email: Email = {
      from: "",
      to: "",
      subject: `Info of ${employee.apellido}, ${employee.nombre}`,
      attachments: [{
          filename: `Info_${employee.apellido}_${employee.nombre}.xlsx`,
          path: xlsxPath
      }]
    }
    await sendEmail(email)
    removeFile(xlsxPath)

    return res.status(200).json({ message: "Email successfully sended!" })
  } catch(error: any) {
    next(error)
  }
}