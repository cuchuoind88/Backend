import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});
export default mongoose.model("tokenModel", tokenSchema);
