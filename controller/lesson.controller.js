import lessonModel from "../models/Lesson.js";
import chapterModel from "../models/Chapter.js";
const lessonCreate = async (req, res) => {
  try {
    // const newLesson = new lessonModel(req.body);
    // await newLesson.save();
    // await chapterModel.updateOne(
    //   { _id: newLesson.chapter },
    //   { $push: { lessons: newLesson._id } }
    // );
    // res.status(200).json({
    //   msg: "Successfully Created A Lesson",
    //   lesson: newLesson,
    // });
    console.log(req.file);
    console.log(req.body);
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
//Lesson Get Tracking
const getCompleted = async (req, res) => {
  try {
    const Lessons = await lessonModel.find(
      { completed: { $in: [req.userID] } },
      { _id: 1 }
    );
    if (Lessons) {
      res.status(200).json({
        result: Lessons,
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
//Lesson Update Tracking
const lessonTracking = async (req, res) => {
  try {
    const existLesson = lessonModel.exists({ _id: req.params.lessonID });
    if (existLesson) {
      if (existLesson.completed) {
        if (!existLesson.completed.includes(req.userID)) {
          await lessonModel.updateOne(
            { _id: req.params.lessonID },
            { $push: { completed: req.userID } }
          );
          res.status(200).json({
            msg: "Successfully Updated Tracking",
          });
        }
      } else {
        await lessonModel.updateOne(
          { _id: req.params.lessonID },
          { $push: { completed: req.userID } }
        );
        res.status(200).json({
          msg: "Successfully Updated Tracking",
        });
      }
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
//Lesson get unlock
const getUnlocked = async (req, res) => {
  try {
    const Lessons = await lessonModel.find(
      { unlock: { $in: [req.userID] } },
      { _id: 1 }
    );
    if (Lessons) {
      res.status(200).json({
        result: Lessons,
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
//Lesson unlock
const lessonUnlock = async (req, res) => {
  try {
    const existLesson = lessonModel.exists({ _id: req.params.lessonID });
    if (existLesson) {
      if (existLesson.unlock) {
        if (!existLesson.unlock.includes(req.userID)) {
          await lessonModel.updateOne(
            { _id: req.params.lessonID },
            { $push: { unlock: req.userID } }
          );
          res.status(200).json({
            msg: "Successfully Updated Tracking",
          });
        }
      } else {
        await lessonModel.updateOne(
          { _id: req.params.lessonID },
          { $push: { unlock: req.userID } }
        );
        res.status(200).json({
          msg: "Successfully Updated Tracking",
        });
      }
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
//Update completed
const updateCompleted = async (req, res) => {
  try {
    // Cập nhật tất cả các mảng "completed" thành một mảng rỗng
    await lessonModel.updateMany({}, { $set: { completed: [] } });
    // Trả về thông báo thành công
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//Update unlock
const updateUnlocked = async (req, res) => {
  try {
    // Cập nhật tất cả các mảng "completed" thành một mảng rỗng
    await lessonModel.updateMany({}, { $set: { unlock: [] } });
    // Trả về thông báo thành công
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  lessonCreate,
  lessonUpdate,
  lessonDelete,
  lessonTracking,
  lessonUnlock,
  getCompleted,
  getUnlocked,
  updateCompleted,
  updateUnlocked,
};
