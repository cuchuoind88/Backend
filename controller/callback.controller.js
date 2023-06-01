import courseModel from "../models/Course.js";
import userModel from "../models/User.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
const CallbackHandler = async (req, res) => {
  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
    let mac = CryptoJS.HmacSHA256(dataStr, process.env.APP_KEY2).toString();
    console.log("mac =", mac);
    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, process.env.APP_KEY2);
      const result = JSON.parse(dataStr);
      const data = JSON.parse(result.embed_data);
      const courseID = data.orderId;
      const userID = result.app_user;
      const existCourse = await courseModel.findOne({ _id: courseID });
      if (existCourse) {
        if (existCourse.enrolledStudent.indexOf(userID) == -1) {
          console.log(existCourse.enrolledStudent.indexOf(userID));
          await courseModel.updateMany(
            { _id: courseID },
            {
              $push: { enrolledStudent: userID },
              $set: { enrolledCount: existCourse.enrolledCount + 1 },
            }
          );
          await userModel.updateOne(
            { _id: userID, role: "student" },
            {
              $push: {
                enrolledCourse: existCourse._id,
              },
            }
          );
        }
      }
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};
export default CallbackHandler;
