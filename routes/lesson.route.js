import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import {
  lessonCreate,
  lessonDelete,
  lessonUpdate,
} from "../controller/lesson.controller.js";
import express from "express";
const lessonRoute = express.Router();
lessonRoute.post("/create", verifyAdminMiddleware, lessonCreate);
lessonRoute.post("/update/:lessonID", verifyAdminMiddleware, lessonUpdate);
lessonRoute.post("/delete/:lessonID", verifyAdminMiddleware, lessonDelete);
export default lessonRoute;
