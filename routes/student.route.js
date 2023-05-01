import express from "express";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import {
  studentLogin,
  studentPassChange,
  studentSignUp,
  studentUpdate,
  studentView,
} from "../controller/student.controller.js";
const studentRoute = express.Router();
//view all user
studentRoute.get("/view-profile", verifyLoginMiddleware, studentView);
//student login
studentRoute.post("/login", studentLogin);
//student sign up
studentRoute.post("/sign-up", studentSignUp);
//student update
studentRoute.put("/update-profile", verifyLoginMiddleware, studentUpdate);
//student password change
studentRoute.post("/change-password", verifyLoginMiddleware, studentPassChange);
export default studentRoute;
