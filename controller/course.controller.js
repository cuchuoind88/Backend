import courseModel from "../models/Course.js";
import userModel from "../models/User.js";
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
//Course enrollment
const courseEnroll = async (req, res) => {
  try {
    const existCourse = await courseModel.findOne({ _id: req.params.courseID });
    if (existCourse) {
      if (existCourse.enrolledStudent.indexOf(req.userID) == -1) {
        await courseModel.updateMany(
          { _id: req.params.courseID },
          {
            $push: { enrolledStudent: req.userID },
            $set: { enrolledCount: existCourse.enrolledCount + 1 },
          }
        );
        await userModel.updateOne(
          { _id: req.userID, role: "student" },
          {
            $push: {
              enrolledCourse: existCourse._id,
            },
          }
        );
      }
      res.status(200).json({
        msg: "Successfully Enrolled A Course",
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
