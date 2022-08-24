import nodemailer from "nodemailer";
import { config } from "../config";
import { Employee } from "../controllers/employee.controller";
import path from "path"

export interface Email {
  from: string,
  to: string,
  subject: string,
  text?: string,
  attachments: Array<Object>
}

export const buildEmail = (recipents: Array<string>, employee: Employee): Email => {
  const recipentsString = recipents.join(",")
  const filename = `Info_${employee.apellido}_${employee.nombre}.xlsx`
  return {
    from: config.EMAIL_ADDRESS,
    to: recipentsString,
    subject: `Info of ${employee.apellido}, ${employee.nombre}`,
    attachments: [{
        filename: filename,
        path: path.join(__dirname, `../temp/${filename}`)
    }]
  }
}

export const sendEmail = async (email: Email) => { 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_ADDRESS,
      pass: config.EMAIL_APP_PASS
    }
  })

  await transporter.sendMail(email)
}