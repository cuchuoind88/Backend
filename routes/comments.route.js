import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import verifyEnrolledMiddelware from "../Middlewares/verifyEnrolled.middeware.js";
import express from "express";
import {
  commentCreate,
  getComment,
} from "../controller/comments.controller.js";
const commentRoute = express.Router();
commentRoute.post(
  "/:courseID/create",
  verifyLoginMiddleware,
  verifyEnrolledMiddelware,
  commentCreate
);
commentRoute.get(
  "/:courseID/:lessonID/getAll",
  verifyLoginMiddleware,
  verifyEnrolledMiddelware,
  getComment
);
export default commentRoute;
