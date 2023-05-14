import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import verifyEnrolledMiddelware from "../Middlewares/verifyEnrolled.middeware.js";
import {
  lessonCreate,
  lessonDelete,
  lessonTracking,
  lessonUpdate,
} from "../controller/lesson.controller.js";
import express from "express";
const lessonRoute = express.Router();
lessonRoute.post("/create", verifyAdminMiddleware, lessonCreate);
lessonRoute.post("/update/:lessonID", verifyAdminMiddleware, lessonUpdate);
lessonRoute.post("/tracking/:lessonID", verifyLoginMiddleware, lessonTracking);
lessonRoute.post("/delete/:lessonID", verifyAdminMiddleware, lessonDelete);
export default lessonRoute;
