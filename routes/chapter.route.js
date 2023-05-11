import verifyAdminMiddleware from "../Middlewares/verifyAdmin.middleware.js";
import verifyLoginMiddleware from "../Middlewares/verifyLogin.middleware.js";
import {
  chapterCreate,
  chapterDelete,
  chapterUpdate,
  chapterViewIndividual,
} from "../controller/chapter.controller.js";
import express from "express";
const chapterRoute = express.Router();
// Chapter View Individual
chapterRoute.get("/view/:courseID/:chapterID", chapterViewIndividual);
// Chapter Create
chapterRoute.post("/create", verifyAdminMiddleware, chapterCreate);
// Chapter Update
chapterRoute.put("/update/:chapterID", verifyAdminMiddleware, chapterUpdate);
// Chapter Delete
chapterRoute.delete("/delete/:chapterID", verifyAdminMiddleware, chapterDelete);
// Export
export default chapterRoute;
