import { Employee } from "../controllers/employee.controller"
const convertCsvToXlsx = require("@aternus/csv-to-xlsx")
import fs from "fs"
import path from "path"

// Función que escribe un archivo CSV, lo transforma en el excel a exportar y devuelve el path donde se guarda
export const writeFile = async (employee: Employee, dependents: Array<string>): Promise<string> => {
  // Escribo el header y el contenido del archivo CSV
  let content: string = writeHeader()
  const boss = await employee.getBoss()
  const bossName = boss ? `${boss.nombre} ${boss.apellido}` : ""
  const employeeInfo = getEmployeeInfo(employee, bossName)
  const employees = [employeeInfo, ...dependents]
  content += employees.join("")

  // Escribo el archivo CSV, si ya existía uno se reemplaza
  const csvPath: string = path.join(__dirname, `../temp/Info_${employee.apellido}_${employee.nombre}.csv`)
  fs.existsSync(csvPath) && removeFile(csvPath)
  fs.writeFileSync(csvPath, content)

  const xlsxPath = path.join(__dirname, `../temp/Info_${employee.apellido}_${employee.nombre}.xlsx`)
  fs.existsSync(xlsxPath) && removeFile(xlsxPath)

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
export const getEmployeeInfo = (employee: Employee, bossName: string): string => {
  return `${employee.apellido} ${employee.nombre},${employee.legajo},${employee.dni},${employee.getAge()},${employee.rol},${bossName},${employee.gerencia},${employee.sector}\n`
}

export const removeFile = (path: string) => {
  fs.unlinkSync(path)
}