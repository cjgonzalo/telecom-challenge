import { Employee } from "../controllers/employee.controller"
const convertCsvToXlsx = require("@aternus/csv-to-xlsx")
import fs from "fs"
import path from "path"

// Función que escribe un archivo CSV, lo transforma en el excel a exportar y devuelve el path donde se guarda
export const writeFile = (employee: Employee, dependents: Array<Employee>): string => {

  let content: string = writeHeader()

  const employees = [employee, ...dependents]

  // Por cada empleado se escribe una linea del archivo CSV
  employees.forEach(employee => {
    content += writeLine(employee)
  })

  const csvPath: string = path.join(__dirname, `../temp/Info_${employee.apellido}_${employee.nombre}.csv`)
  fs.writeFileSync(csvPath, content)
  const xlsxPath = path.join(__dirname, `../temp/Info_${employee.apellido}_${employee.nombre}.xlsx`)

  try {
    convertCsvToXlsx(csvPath, xlsxPath)
    removeFile(csvPath)
  } catch(error: any) {
    throw error
  }

  return xlsxPath
}

// Header del archivo a exportar
const writeHeader = (): string => {
  return "Apellido y Nombre,Legajo,DNI,Edad,Rol,Superior Inmediato,Gerencia,Sector\n"
}

// Linea CSV que contiene la información del empleado
const writeLine = (employee: Employee): string => {
  return `${employee.apellido} ${employee.nombre},${employee.legajo},${employee.dni},${employee.getAge()},${employee.rol},${employee.dni_jefe ? employee.dni_jefe : ""},${employee.gerencia},${employee.sector}\n`
}

export const removeFile = (path: string) => {
  fs.unlinkSync(path)
}