import lessonModel from "../models/Lesson.js";
import chapterModel from "../models/Chapter.js";
const lessonCreate = async (req, res) => {
  try {
    const newLesson = new lessonModel(req.body);
    await newLesson.save();
    await chapterModel.updateOne(
      { _id: newLesson.chapter },
      { $push: { lessons: newLesson._id } }
    );
    res.status(200).json({
      msg: "Successfully Created A Lesson",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// Lesson Update
const lessonUpdate = async (req, res) => {
  try {
    const existLesson = lessonModel.exists({ _id: req.params.lessonID });
    if (existLesson) {
      await lessonModel.updateOne(
        { _id: req.params.lessonID },
        { $set: { ...req.body, updated_at: Date.now() } }
      );
      res.status(200).json({
        msg: "Successfully Updated A Lesson",
      });
    } else {
      res.status(400).json({
        msg: "Lesson Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// Lesson Delete
const lessonDelete = async (req, res) => {
  try {
    const existLesson = lessonModel.exists({ _id: req.params.lessonID });
    if (existLesson) {
      await lessonModel.deleteOne({ _id: req.params.lessonID });
      res.status(200).json({
        msg: "Successfully Deleted A Video",
      });
    } else {
      res.status(400).json({
        msg: "Lesson Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

export { lessonCreate, lessonUpdate, lessonDelete };
