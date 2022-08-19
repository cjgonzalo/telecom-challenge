import mongoose from "mongoose";

mongoose.connect(String(process.env.DB_URI))
  .then(() => console.log("Mongo client connected"))
  .catch(error => console.error(error))

module.exports = mongoose