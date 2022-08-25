import { Request, Response, NextFunction } from "express"
import { EmployeeError } from "../errors/employee.error"
import { removeFile, writeFile } from "../helpers/file-writer"
import { buildEmail, Email, sendEmail } from "../helpers/mail-sender.helper"
import { getAllDependents, validEmail } from "../helpers/employee.helper"
import { isValidObjectId } from "mongoose"

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
  getImmediateDependents(): Promise<Array<Employee>>
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

export const getEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined | void> => {
  try {
    // Si el filtro recibidono es un id se pasa al siguiente controlador
    if(!isValidObjectId(req.params.filter)) {
      return next()
    }

    return await EmployeeModel.findById(req.params.filter)
      .then((employee: Employee) => {
        if(!employee) {
          throw new EmployeeError(404, `No employee found with id ${req.params.filter}`)
        }
        return res.status(200).json(employee)
      })
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const getEmployeeByFileNumber = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    return await EmployeeModel.findOne({
      legajo: req.params.filter
    })
    .then((employee: Employee) => {
      if(!employee) {
        throw new EmployeeError(404, `No employee found with file ${req.params.filter}`)
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
    const filter = isValidObjectId(req.params.filter) ?
      { _id: req.params.filter } :
      { legajo: req.params.filter }

    return await EmployeeModel.findOneAndUpdate(
        filter,
        employeeFields
      )
      .then(() => res.status(200).json({ message: "Employee successfully updated!" }))
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    const filter = isValidObjectId(req.params.filter) ?
      { _id: req.params.filter } :
      { legajo: req.params.filter }

    return await EmployeeModel.findOneAndDelete(filter)
      .then((deletedEmployee: Employee) => res.status(200).json(deletedEmployee))
      .catch((error: any) => { throw error })

  } catch(error: any) {
    next(error)
  }
}

export const sendEmployeeInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    const recipents: Array<string> = req.body.recipents
    if(recipents.length === 0) {
      throw new EmployeeError(400, "At least one recipent is required")
    }

    recipents.forEach(recipent => {
      if(!validEmail(recipent)) {
        throw new EmployeeError(402, `${recipent} is not a valid email address`)
      }
    })

    const employee = await EmployeeModel.findById(req.params.id)
    const dependentsInfo = await getAllDependents(employee, []) // El acumulador empieza como un array vacío
    const xlsxPath = writeFile(employee, dependentsInfo)
    
    const email: Email = buildEmail(recipents, employee)
    await sendEmail(email)
    removeFile(xlsxPath)

    return res.status(200).json({ message: "Email successfully sended, if you can't find it, please check out your spam box" })
  } catch(error: any) {
    next(error)
  }
}