import express from "express";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import {
  courseCreate,
  courseDetail,
  courseViewAll,
} from "../controller/course.controller.js";
const courseRouter = express.Router();
courseRouter.get("/viewall", verifyLoginMiddleware, courseViewAll);
courseRouter.get("/:courseId", verifyLoginMiddleware, courseDetail);
courseRouter.post("/create-course", verifyAdminMiddleware, courseCreate);
export default courseRouter;
