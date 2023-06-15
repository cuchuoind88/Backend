import express from "express";
import mongoose from "mongoose";
const app = express();
import studentRoute from "./routes/student.route.js";
import cors from "cors";
import dotenv from "dotenv";
import courseRouter from "./routes/course.route.js";
import chapterRoute from "./routes/chapter.route.js";
import { Server } from "socket.io";
import lessonRoute from "./routes/lesson.route.js";
import * as http from "http";
import commentRoute from "./routes/comments.route.js";
import callbackRoute from "./routes/callback.route.js";
import userRoute from "./routes/user.route.js";
import bodyParser from "body-parser";
dotenv.config();
const connect = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});
connect.then((db) => {
  console.log("Connected correctly to server");
});
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/student", studentRoute);
app.use("/user", userRoute);
app.use("/course", courseRouter);
app.use("/chapter", chapterRoute);
app.use("/lesson", lessonRoute);
app.use("/comments", commentRoute);
app.use("/zalo", callbackRoute);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {
    const { username, lesson, avatar } = data; // Data sent from client when join_room event emitted
    console.log(username);
    console.log(lesson);
    socket.join(lesson); // Join the user to a socket room
    socket.on("send_message", (message) => {
      io.to(lesson).emit("receive_message", {
        content: `${message.message}`,
        author: {
          avatar: avatar,
          username: username,
        },
      });
    });
  });
  socket.on("leave_room", (lesson) => {
    socket.leave(lesson);
  });
});
server.listen(2002, () => {
  console.log("Server is running..... :)))");
});
