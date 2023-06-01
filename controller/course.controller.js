import courseModel from "../models/Course.js";
import userModel from "../models/User.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment/moment.js";
import { v1 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
const courseSearch = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    console.log(searchQuery);
    const searchQueryRegex = searchQuery
      .split(" ")
      .map((term) => `${term.trim()}.*`)
      .join("|");
    const courses = await courseModel.find({
      $or: [{ title: { $regex: searchQueryRegex, $options: "i" } }],
    });
    res.status(200).json({
      result: courses,
      msg: "Successfully Search Course",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
const courseViewAll = async (req, res) => {
  try {
    const existCourse = await courseModel.find();

    if (existCourse) {
      res.status(200).json({
        result: existCourse,
        msg: "Successfully Got All Course",
      });
    } else {
      res.status(400).json({
        msg: "Courses Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Course Detail
const courseDetail = async (req, res) => {
  try {
    const existCourse = await courseModel.findOne({ _id: req.params.courseId });
    if (existCourse) {
      await courseModel.updateOne(
        { _id: req.params.courseID },
        { $set: { views: existCourse.views + 1 } }
      );
      res.status(200).json({
        result: existCourse,
        msg: "Successfully View  Course Detail",
      });
    } else {
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Courses Create
const courseCreate = async (req, res) => {
  try {
    const newCourse = new courseModel(req.body);
    await newCourse.save();
    res.status(200).json({
      msg: "Successfully Created A Course",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Course enrollment
const courseEnroll = async (req, res) => {
  try {
    //zalo pay
    const embed_data = {
      redirecturl: `https://8b40-113-161-34-227.ngrok-free.app/${req.body.courseId}`,
      orderId: req.body.courseId,
    };
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: process.env.APP_ID,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // mã giao dich có định dạng yyMMdd_xxxx
      app_user: req.userID,
      callback_url: "https://d498-125-235-239-36.ngrok-free.app/zalo/callback",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: req.body.price,
      description: `Thanh toan khoa hoc ${req.body.courseName}`,
      bank_code: "",
    };
    const data =
      process.env.APP_ID +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, process.env.APP_KEY1).toString();
    var orderURL;
    // let reqtime = Date.now();
    // let params = {
    //   appid: process.env.APP_ID,
    //   reqtime: reqtime, // miliseconds
    //   mac: CryptoJS.HmacSHA256(
    //     process.env.APP_ID + "|" + reqtime,
    //     process.env.APP_KEY1
    //   ).toString(), // appid|reqtime
    // };
    // axios
    //   .get("https://sbgateway.zalopay.vn/api/getlistmerchantbanks", { params })
    //   .then((res) => {
    //     let banks = res.data.banks;
    //     for (let id in banks) {
    //       let banklist = banks[id];
    //       console.log(id + ".");
    //       for (let bank of banklist) {
    //         console.log(bank);
    //       }
    //     }
    //   })
    //   .catch((err) => console.error(err));
    // const existCourse = await courseModel.findOne({ _id: req.params.courseID });
    // if (existCourse) {
    //   if (existCourse.enrolledStudent.indexOf(req.userID) == -1) {
    //     console.log(existCourse.enrolledStudent.indexOf(req.userID));
    console.log(order);
    await axios
      .post(process.env.ZALO_ENDPOINT, null, { params: order })
      .then((res) => {
        console.log(res.data);
        orderURL = res.data.order_url;
      });
    // await courseModel.updateMany(
    //   { _id: req.params.courseID },
    //   {
    //     $push: { enrolledStudent: req.userID },
    //     $set: { enrolledCount: existCourse.enrolledCount + 1 },
    //   }
    // );
    //   await userModel.updateOne(
    //     { _id: req.userID, role: "student" },
    //     {
    //       $push: {
    //         enrolledCourse: existCourse._id,
    //       },
    //     }
    //   );
    // }
    console.log(orderURL);
    res.status(200).json({
      msg: "Redirect to Zalo Pay Gatewap ...",
      url: orderURL,
    });
    // } else {
    //   res.status(400).json({
    //     msg: "Course Not Found",
    //   });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// View Enrolled Course
const courseViewEnrolled = async (req, res) => {
  try {
    const existCourse = await courseModel
      .findOne({ _id: req.params.courseID })
      .populate({
        path: "chapters",
        populate: {
          path: "lessons",
          model: "lessonModel",
          // populate: {
          //   // path: "comments",
          //   // // model: "commentModel",
          //   // // select: "content author",
          //   // populate: {
          //   //   path: "author",
          //   //   model: "userModel",
          //   //   select: "username",
          //   // },
          // },
        },
      });
    if (existCourse) {
      // console.log("Watching")
      res.status(200).json({
        result: existCourse,
        msg: "You are watching enrolled course",
      });
    } else {
      res.status(400).json({
        msg: "Course Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

export {
  courseCreate,
  courseDetail,
  courseViewAll,
  courseEnroll,
  courseViewEnrolled,
  courseSearch,
};
