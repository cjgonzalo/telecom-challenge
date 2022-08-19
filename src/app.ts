import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import cors from "cors"

dotenv.config()
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

app.listen(app.get("port"), () => {
  console.log(`App listening on port ${app.get("port")}`)
})