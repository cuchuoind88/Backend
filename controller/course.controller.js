import courseModel from "../models/Course.js";
import userModel from "../models/User.js";
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
    const existCourse = await courseModel.findById(req.params.courseId);
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
export { courseCreate, courseDetail, courseViewAll };
