import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  file: { type: String, required: true, trim: true },
  id: { type: String, required: true, trim: true },
  birthday: { type: String, required: true, trim: true }, // TODO: maybe use Date?
  role: { type: String, required: true, trim: true },
  bossId: { type: String, trim: true },
  gerency: { type: String, required: true, trim: true },
  sector: { type: String, required: true, trim: true }
})

module.exports = model("Employee", employeeSchema)