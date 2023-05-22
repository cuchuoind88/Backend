import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import verifyEnrolledMiddelware from "../Middlewares/verifyEnrolled.middeware.js";
import {
  getCompleted,
  getUnlocked,
  lessonCreate,
  lessonDelete,
  lessonTracking,
  lessonUnlock,
  lessonUpdate,
  updateCompleted,
  updateUnlocked,
} from "../controller/lesson.controller.js";
import express from "express";
const lessonRoute = express.Router();
lessonRoute.post("/create", verifyAdminMiddleware, lessonCreate);
lessonRoute.post("/update/:lessonID", verifyAdminMiddleware, lessonUpdate);
lessonRoute.post("/tracking/:lessonID", verifyLoginMiddleware, lessonTracking);
lessonRoute.post("/unlock/:lessonID", verifyLoginMiddleware, lessonUnlock);
lessonRoute.get("/get-completed", verifyLoginMiddleware, getCompleted);
lessonRoute.get("/get-unlocked", verifyLoginMiddleware, getUnlocked);
lessonRoute.post("/delete/:lessonID", verifyAdminMiddleware, lessonDelete);
lessonRoute.put("/update-completed", updateCompleted);
lessonRoute.put("/update-unlocked", updateUnlocked);
export default lessonRoute;
