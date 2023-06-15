import express from "express";
import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import { ViewAllUser, userView } from "../controller/user.controller.js";
// Router Init
const userRoute = express.Router();
// All User View
userRoute.get("/view", verifyAdminMiddleware, ViewAllUser);
userRoute.get("/view/:username", verifyAdminMiddleware, userView);
export default userRoute;
