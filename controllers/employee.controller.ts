import { Request, Response, NextFunction } from "express"
import { EmployeeError } from "../errors/employee.error"

const EmployeeSchema = require("../models/employee.model")

interface Employee {
  name: string,
  surname: string,
  file: string,
  id: string,
  birthday: Date,
  role: string,
  bossId?: string,
  gerency: string,
  sector: string
}

// Returns all the existing employees
export const getEmployees = async (_req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
  try {
    return await EmployeeSchema.find()
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
    return await EmployeeSchema.findById(req.params.id)
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
    const employee = new EmployeeSchema(employeeFields)

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

    return await EmployeeSchema.findOneAndUpdate(
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
    return await EmployeeSchema.findOneAndDelete({
      _id: req.params.id
    })
    .then((deletedEmployee: Employee) => res.status(200).json(deletedEmployee))
  } catch(error: any) {
    next(error)
  }
}