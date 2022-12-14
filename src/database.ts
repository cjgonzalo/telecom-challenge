import { config } from "../config"
import mongoose from "mongoose";

export const connectDatabase = async () => {
  await mongoose.connect(config.DB_URI)
    .then(() => console.log("Mongo client connected"))
    .catch(error => console.error(error))
}

// module.exports = mongoose