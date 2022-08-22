import nodemailer from "nodemailer";

export interface Email {
  from: string,
  to: string,
  subject: string,
  text?: string,
  attachments: Array<Object>
}

export const sendEmail = async (email: Email) => { 
  const testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })
  email.from = testAccount.user
  email.to = testAccount.user

  await transporter.sendMail(email).then(info => console.log(nodemailer.getTestMessageUrl(info)))
}