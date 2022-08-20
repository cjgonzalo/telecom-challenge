import dotenv from "dotenv"
dotenv.config()
import express, { NextFunction, Request, Response} from "express"
import morgan from "morgan"
import cors from "cors"
require("./database")
import employeeRouter from "../routes/employee.router"
import { EmployeeError } from "../errors/employee.error"

const app = express()

// Settings
app.set("port", process.env.APP_PORT || 8080)

// Middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use("/employee", employeeRouter)

// Error handler, si el error es un EmployeeError devuelve el mensaje con su código, sino el mensajo con código error 500
app.use((error: EmployeeError, _req: Request, res: Response, _next: NextFunction) => {
  return error.code ?
    res.status(error.code).json({ message: error.message }) :
    res.status(500).json({ message: error.message })
})

app.use((_req: Request, res: Response) => {
  return res.status(404).json({ message: "Page not found" })
})

app.listen(app.get("port"), () => {
  console.log(`App listening on port ${app.get("port")}`)
})