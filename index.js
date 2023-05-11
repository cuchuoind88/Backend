import express from "express";
import mongoose from "mongoose";
const app = express();
import studentRoute from "./routes/student.route.js";
import cors from "cors";
import dotenv from "dotenv";
import courseRouter from "./routes/course.route.js";
import chapterRoute from "./routes/chapter.route.js";
import lessonRoute from "./routes/lesson.route.js";
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
app.use("/course", courseRouter);
app.use("/chapter", chapterRoute);
app.use("/lesson", lessonRoute);
app.listen(2002, () => {
  console.log("Server is running..... :)))");
});
