import express from "express";
import CallbackHandler from "../controller/callback.controller.js";
const callbackRoute = express.Router();
//xu ly callback tu Zalo Server
callbackRoute.post("/callback", CallbackHandler);
export default callbackRoute;
