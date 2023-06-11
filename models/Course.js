import mongoose from "mongoose";
const courseSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  courseDetails: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: "0",
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
  enrolledStudent: [
    {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
    },
  ],
  enrolledCount: {
    type: Number,
    default: "0",
    required: true,
  },
  chapters: [
    {
      type: mongoose.Types.ObjectId,
      ref: "chapterModel",
    },
  ],
  status: {
    type: String,
    default: "active",
  },
});
const courseModel = mongoose.model("courseModel", courseSchema);
export default courseModel;
