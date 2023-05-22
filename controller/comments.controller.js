import commentModel from "../models/Comment.js";
import lessonModel from "../models/Lesson.js";
const getComment = async (req, res) => {
  try {
    const existComment = await lessonModel
      .findOne({ _id: req.params.lessonID })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "userModel",
          select: "username avatar",
        },
      });
    if (existComment) {
      // console.log("Watching")
      res.status(200).json({
        result: existComment,
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
const commentCreate = async (req, res) => {
  try {
    const newComment = new commentModel({
      author: req.userID,
      lesson: req.body.lesson,
      content: req.body.content,
    });
    await newComment.save();
    await lessonModel.updateOne(
      {
        _id: req.body.lesson,
      },
      {
        $push: { comments: newComment._id },
      }
    );
    res.status(200).json({
      msg: "Successfully Created A Comment",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
export { commentCreate, getComment };
