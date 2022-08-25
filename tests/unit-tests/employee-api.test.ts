import request from "supertest"
import { server } from "../../src/app"
import mongoose from "mongoose"
import { getEmployeeInfo, writeFile } from "../../helpers/file-writer"
import { sendEmail } from "../../helpers/mail-sender.helper"
import { getAllDependents } from "../../helpers/employee.helper"
import { Employee } from "../../controllers/employee.controller"

describe("employee controllers tests", () => {
  const EmployeeModel = require("../../models/employee.model")

  const gonzalo = {
    nombre: "Gonzalo",
    apellido: "Casanova",
    fecha_cumpleanios: "30/11/1999",
    legajo: "x1111",
    dni: 42249481,
    rol: "Supervisor",
    gerencia: "B2C",
    sector: "Fibertel",
    dni_jefe: 35013291
  }

  const renata = {
    nombre: "Renata",
    apellido: "Sanchez",
    fecha_cumpleanios: "25/04/1984",
    legajo: "x2222",
    dni: 35013291,
    rol: "Supervisor",
    gerencia: "B2C",
    sector: "Fibertel",
    dni_jefe: 31225876
  }

  const testEmployees = [gonzalo, renata]

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () =>{
    server.close()
    await mongoose.disconnect()
  })

  describe("GET requests to /employee", () => {
    it("should return an array of Employees", async () => {
      jest.spyOn(EmployeeModel, "find").mockResolvedValue(testEmployees);
  
      await request(server)
        .get("/employee")
        .set("Accept", "application/json")
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body).toEqual(testEmployees)
        })
        .catch(error => expect(error).not.toBeDefined())
      })
  
    it("should return a 404 status code with an error message", async () => {
      jest.spyOn(EmployeeModel, "find").mockResolvedValue([]);
  
      await request(server)
        .get("/employee")
        .set("Accept", "application/json")
        .then(res => {
          expect(res.status).toEqual(404)
          expect(res.body).toHaveProperty("message", "No employees found!")
        })
        .catch(error => expect(error).not.toBeDefined())
    })
  })

  describe("POST request to /employee", () => {
    it("should return the new employee", async () => {
      jest.spyOn(EmployeeModel.prototype, "save").mockResolvedValue(Promise.resolve(renata))

      await request(server)
        .post("/employee")
        .set("Accept", "application/json")
        .send(renata)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body).toEqual(renata)
        })
        .catch(error => expect(error).not.toBeDefined())
    })
  })

  describe("PUT request to /employee/:filter", () => {
    it("should update the name", async () => {
      const fieldsToUpdate = {
        rol: "Gerente",
        sector: "Personal"
      }
      jest.spyOn(EmployeeModel, "findOneAndUpdate").mockResolvedValue({ message: "Employee successfully updated!" })

      await request(server)
        .put(`/employee/${renata.legajo}`)
        .set("Accept", "application/json")
        .send(fieldsToUpdate)
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body).toHaveProperty("message", "Employee successfully updated!")
        })
        .catch(error => expect(error).not.toBeDefined())
    })
  })

  describe("DELETE request to /employee/:filter", () => {
    it("should return gonzalo", async () => {
      jest.spyOn(EmployeeModel, "findOneAndDelete").mockResolvedValue(gonzalo)
  
      await request(server)
        .delete(`/employee/${gonzalo.legajo}`)
        .set("Accept", "application/json")
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body).toEqual(gonzalo)
        })
        .catch(error => expect(error).not.toBeDefined())
    })
  })
})