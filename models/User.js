import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    index: true,
  },
  verifyCode: {
    type: String,
    default: "",
    expires: 3600,
  },
  isVerified: {
    type: Boolean,
    default: "false",
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
  avatar: {
    type: String,
    default:
      "https://demos.creative-tim.com/black-dashboard-react/static/media/anime3.4438e506.png",
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
