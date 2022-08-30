import { Employee } from "../../controllers/employee.controller"
import { getAllDependents, validEmail } from "../../helpers/employee.helper"
import { getEmployeeInfo } from "../../helpers/file-writer"

describe("employee helpers tests", () => {

  describe("valid email test", () => {
    it("should return true", () => {
      const email = "gonicasanova.gc@gmail.com"
      expect(validEmail(email)).toBe(true)
    })

    it("should return false", () => {
      const email = "NotAnEmail"
      expect(validEmail(email)).toBe(false)
    })
  })

  describe("get all dependents tests", () => {
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
      getBoss() { return Promise.resolve(marcelo)}
    }
  
    const marcelo: Employee = {
      nombre: "Marcelo",
      apellido: "Gerez",
      fecha_cumpleanios: "17/08/1983",
      legajo: "x1133",
      dni: 29923710,
      rol: "Gerente",
      gerencia: "B2C",
      sector: "Fibertel",

      getAge() { return 40 },
      getImmediateDependents() { return Promise.resolve([roberto]) },
      getBoss() { return Promise.resolve(undefined) }
    }

    it("should return an [roberto]", async () => {
      // jest.fn(getEmployeeInfo)
      //   .mockImplementation((employee, _bossName) => employee)

      const dependents = await getAllDependents(marcelo, [])

      expect(dependents.length).toEqual(1)
      expect(dependents[0]).toEqual(getEmployeeInfo(roberto, `${marcelo.apellido} ${marcelo.nombre}`))
    })
  })
})