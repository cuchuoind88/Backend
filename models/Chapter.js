import mongoose from "mongoose";
const chapterSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "courseModel",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  lessons: [
    {
      type: mongoose.Types.ObjectId,
      ref: "lessonModel",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});
const chapterModel = mongoose.model("chapterModel", chapterSchema);
export default chapterModel;
