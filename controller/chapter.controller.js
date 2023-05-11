import chapterModel from "../models/Chapter.js";
import courseModel from "../models/Course.js";
// Chapter View Individual
const chapterViewIndividual = async (req, res) => {
  try {
    const existChapter = await chapterModel.findOne({
      _id: req.params.chapterID,
    });
    if (existChapter) {
      res.status(200).json({
        result: existChapter,
        msg: "Successfully Watched A Chapter",
      });
    } else {
      res.status(400).json({
        msg: "Chapter Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Create Chapter
const chapterCreate = async (req, res) => {
  try {
    const newChapter = new chapterModel(req.body);
    await newChapter.save();
    await courseModel.updateOne(
      { _id: newChapter.course },
      { $push: { chapters: newChapter._id } }
    );
    res.status(200).json({
      msg: "Successfully Created A Chapter",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// Chapter Update
const chapterUpdate = async (req, res) => {
  try {
    const existChapter = chapterModel.findOne({ _id: req.params.chapterID });
    if (existChapter) {
      await chapterModel.updateOne(
        { _id: req.params.chapterID },
        { $set: { ...req.body, updated_at: Date.now() } }
      );
      res.status(200).json({
        msg: "Successfully Updated A Chapter",
      });
    } else {
      res.status(400).json({
        msg: "Chapter Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// Chapter Delete
const chapterDelete = async (req, res) => {
  try {
    const existChapter = chapterModel.findOne({ _id: req.params.chapterID });
    if (existChapter) {
      await chapterModel.deleteOne({ _id: req.params.chapterID });
      res.status(200).json({
        msg: "Successfully Deleted A Chapter",
      });
    } else {
      res.status(400).json({
        msg: "Chapter Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
export { chapterCreate, chapterDelete, chapterUpdate, chapterViewIndividual };
