import mongoose from "mongoose";
const lessonSchema = mongoose.Schema({
  video: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "courseModel",
    required: true,
  },
  chapter: {
    type: mongoose.Types.ObjectId,
    ref: "chapterModel",
    required: true,
  },
  completed: [
    {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
    },
  ],
});
const lessonModel = mongoose.model("lessonModel", lessonSchema);
export default lessonModel;
