import express, { NextFunction, Request, Response} from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import employeeRouter from "../routes/employee.router"
import { EmployeeError } from "../errors/employee.error"
import { config } from "../config"
import { connectDatabase } from "./database"

dotenv.config()
const app = express()

// Settings
app.set("port", config.APP_PORT || 8080)

// Middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use("/employee", employeeRouter)

// Error handler, si el error es de tipo EmployeeError devuelve el mensaje con su código, de lo contrario el mensaje con código error 500
app.use((error: EmployeeError, _req: Request, res: Response, _next: NextFunction) => {
  return isNaN(error.code) ?
    res.status(500).json({ message: error.message }) :
    res.status(error.code).json({ message: error.message })
})

// Si la ruta solicitada no existe se devuelve not found
app.use((_req: Request, res: Response) => {
  return res.status(404).json({ message: "Page not found" })
})

export const server = app.listen(app.get("port"), async () => {
  await connectDatabase()
  console.log(`App listening on port ${app.get("port")}`)
})

// module.exports = server