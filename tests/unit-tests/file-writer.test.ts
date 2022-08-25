import { Employee } from "../../controllers/employee.controller"
import { getEmployeeInfo, writeFile } from "../../helpers/file-writer"
const convertCsvToXlsx = require("@aternus/csv-to-xlsx")
import path from "path"
import fs from "fs"


describe("file writer tests", () => {
  const roberto: Employee = {
    nombre: "Roberto",
    apellido: "Gonzalez",
    fecha_cumpleanios: "12/01/1993",
    legajo: "x1234",
    dni: 37590126,
    rol: "Representante",
    gerencia: "B2C",
    sector: "Fibertel",
    dni_jefe: 29923710,

    getAge() { return 30 },
    getImmediateDependents() { return Promise.resolve([]) },
  }

  describe("get employee info test", () => {
    it("should return atring type", () => {
      const info = getEmployeeInfo(roberto, "")
      expect(typeof info === typeof "").toBe(true)
    })
  })

  describe("write file test", () => {
    it("should return the path of the file", () => {
      jest.fn(writeFile)
        .mockImplementation((employee, dependents) => path.join(__dirname, `../../temp/Info_${employee.apellido}_${employee.nombre}.xlsx`))
      
      const filePath = writeFile(roberto, [])
      expect(filePath).toEqual(path.join(__dirname, `../../temp/Info_${roberto.apellido}_${roberto.nombre}.xlsx`))
      fs.unlinkSync(filePath)
    })
  })
})