import express from "express";
import mongoose from "mongoose";
const app = express();
import studentRoute from "./routes/student.route.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const connect = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});
connect.then((db) => {
  console.log("Connected correctly to server");
});
app.use(cors());
app.use(express.json());
app.use("/student", studentRoute);
app.listen(2002, () => {
  console.log("Server is running..... :)))");
});
