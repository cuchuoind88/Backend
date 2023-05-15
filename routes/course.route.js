import express from "express";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import verifyEnrolledMiddelware from "../Middlewares/verifyEnrolled.middeware.js";
import {
  courseCreate,
  courseDetail,
  courseViewAll,
  courseEnroll,
  courseViewEnrolled,
  courseSearch,
} from "../controller/course.controller.js";
const courseRouter = express.Router();
courseRouter.get("/viewall", verifyLoginMiddleware, courseViewAll);
courseRouter.get("/:courseId", verifyLoginMiddleware, courseDetail);
courseRouter.post("/create-course", verifyAdminMiddleware, courseCreate);
courseRouter.post("/enroll/:courseID", verifyLoginMiddleware, courseEnroll);
courseRouter.get("/api/search", verifyLoginMiddleware, courseSearch);
courseRouter.get(
  "/viewenrolled/:courseID",
  verifyLoginMiddleware,
  verifyEnrolledMiddelware,
  courseViewEnrolled
);
export default courseRouter;
