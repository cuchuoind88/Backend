import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "userModel",
  },
  lesson: {
    type: mongoose.Types.ObjectId,
    ref: "lessonModel",
  },
});
const commentModel = mongoose.model("commentModel", commentSchema);
export default commentModel;
