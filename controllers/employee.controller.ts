import { Request, Response, NextFunction } from "express"
import { EmployeeError } from "../errors/employee.error"
import { removeFile, writeFile } from "../helpers/file-writer"
import { Email, sendEmail } from "../helpers/mail-sender.helper"
import path from "path"

const EmployeeModel = require("../models/employee.model")

export interface Employee {
  nombre: string,
  apellido: string,
  legajo: string,
  dni: string,
  fecha_cumpleanios: string,
  rol: string,
  dni_jefe?: string,
  gerencia: string,
  sector: string,

  getAge(self: Employee): number
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
    const employee = await EmployeeModel.find()//EmployeeModel.findById(req.params.id)
    writeFile(employee)
    const xlsxPath = path.join(__dirname, `../temp/Info_${employee[0].apellido}_${employee[0].nombre}.xlsx`)

    const email: Email = {
      from: "",
      to: "",
      subject: `Info of ${employee[0].apellido}, ${employee[0].nombre}`,
      attachments: [{
          filename: `Info_${employee[0].apellido}_${employee[0].nombre}.xlsx`,
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