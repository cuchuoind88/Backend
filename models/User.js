import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "student"],
  },
  enrolledCourse: [
    {
      type: mongoose.Types.ObjectId,
      ref: "courseModel",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
const userModel = new mongoose.model("userModel", userSchema);
export default userModel;
