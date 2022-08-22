import { Employee } from "../controllers/employee.controller"
const convertCsvToXlsx = require("@aternus/csv-to-xlsx")
import fs from "fs"
import path from "path"

export const writeFile = (employees: Array<Employee>) => {

  let content: string = writeHeader()

  employees.forEach(employee => {
    content += writeLine(employee)
  })

  const csvPath: string = path.join(__dirname, `../temp/Info_${employees[0].apellido}_${employees[0].nombre}.csv`)

  fs.writeFileSync(csvPath, content)

  try {
    const xlsxPath = path.join(__dirname, `../temp/Info_${employees[0].apellido}_${employees[0].nombre}.xlsx`)
    convertCsvToXlsx(csvPath, xlsxPath)
  } catch(error: any) {
    throw error
  }

  removeFile(csvPath)
}

const writeHeader = (): string => {
  return "Apellido y Nombre,Legajo,DNI,Edad,Rol,Superior Inmediato,Gerencia,Sector\n"
}

const writeLine = (employee: Employee): string => {
  return `${employee.apellido} ${employee.nombre},${employee.legajo},${employee.dni},${employee.getAge(employee)},${employee.rol},${employee.dni_jefe},${employee.gerencia},${employee.sector}\n`
}

export const removeFile = (path: string) => {
  fs.unlinkSync(path)
}