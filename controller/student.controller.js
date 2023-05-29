import bcrypt from "bcrypt";
import userModel from "../models/User.js";
import JWT from "jsonwebtoken";
import tokenModel from "../models/Token.js";
import crypto from "crypto";
import sendEmail from "../utils/mail/sendMail.js";
import uniqueString from "../utils/uniqueString.js";
//Signup
const studentSignUp = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    res.json({
      status: "unsucessful",
      message: "Email already exists!",
    });
  } else {
    const hashpass = await bcrypt.hash(req.body.password, 10);
    const verifyCode = uniqueString();
    console.log(verifyCode);
    let newuser = new userModel({
      ...req.body,
      password: hashpass,
      verifyCode,
    });
    newuser.save();
    sendEmail(
      newuser.email,
      "Get your verify Code",
      {
        name: newuser.username,
        verifyCode,
      },
      "./utils/template/verifyCode.handlebars"
    );
    // const token = JWT.sign(
    //   {
    //     userID: newuser._id,
    //     userName: newuser.username,
    //     userRole: newuser.role,
    //   },
    //   process.env.JWT_SECRET_KEY,
    //   {
    //     expiresIn: "15d",
    //   }
    // );
    res.json({
      email: req.body.email,
      message: "Please Check Your Email",
    });
  }
};
//User verify account
const verifyAcount = async (req, res) => {
  try {
    const { email, verifyCode } = req.body;
    // Tìm kiếm người dùng dựa trên email và mã xác thực
    const user = await userModel.findOne({ email, verifyCode });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    // Cập nhật trạng thái xác thực của người dùng
    user.isVerified = true;
    await user.save();
    // Trả về phản hồi thành công
    res.json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify user" });
  }
};
//User Sign In
const studentLogin = async (req, res) => {
  try {
    const existsStudent = await userModel.findOne({
      username: req.body.username,
    });
    if (existsStudent) {
      const isValidPass = await bcrypt.compare(
        req.body.password,
        existsStudent.password
      );
      if (isValidPass && existsStudent.isVerified) {
        const token = JWT.sign(
          {
            userID: existsStudent._id,
            userName: existsStudent.username,
            userRole: existsStudent.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "15d",
          }
        );
        res.status(200).json({
          token: token,
          msg: "Succesfully Logged In",
        });
      } else {
        res.status(401).json({
          msg: "Auth Error",
        });
      }
    } else {
      res.status(401).json({
        msg: "Auth Error",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Student profile
const studentView = async (req, res) => {
  try {
    console.log(req.userID);
    const student = await userModel.findOne(
      {
        _id: req.userID,
      },
      { password: 0 }
    );
    console.log(student);
    res.json({
      result: student,
      message: "Sucessfully view profile",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
    console.log(err);
  }
};
//Student update profile
const studentUpdate = async (req, res) => {
  try {
    console.log(req.userID);
    const existStudent = await userModel.findOne({
      _id: req.userID,
      role: "student",
    });
    console.log(existStudent);
    if (existStudent) {
      await userModel.updateOne(
        {
          _id: req.userID,
          role: "student",
        },
        { $set: { ...req.body, updated_at: Date.now() } }
      );
      res.json({
        message: "Update sucsessfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
// Student Change Password
const studentPassChange = async (req, res) => {
  try {
    const existStudent = await userModel.findOne({
      _id: req.userID,
    });
    console.log(existStudent);
    if (existStudent) {
      const isOldPassword = await bcrypt.compare(
        req.body.oldPassword,
        existStudent.password
      );
      if (isOldPassword) {
        console.log(isOldPassword);
        const newHashedPass = await bcrypt.hash(req.body.newPassword, 10);
        const newpass = await userModel.updateOne(
          { _id: req.userID, role: "student" },
          {
            $set: {
              password: newHashedPass,
            },
          }
        );
        res.json({
          result: newpass,
          message: "update sucessfully",
        });
      } else {
        res.status(401).json({
          msg: "Did not matched your old password",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
//Request to Reset Password
const RequestPasswordReset = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      res.json({
        message: "User not exists",
      });
    } else {
      let token = await tokenModel.findOne({ UserId: user._id });
      if (token) {
        token.deleteOne();
      }
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, 10);
      let newToken = new tokenModel({
        UserId: user._id,
        token: hash,
        createAt: Date.now(),
      });
      newToken.save();
      console.log(newToken);
      const link = `${process.env.clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
      sendEmail(
        user.email,
        "Password Reset Request",
        { link: link },
        "./utils/template/requestResetPassword.handlebars"
      );
      res.json({
        message: "Please check your email",
        click: link,
      });
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
//Reset Password
const resetPassword = async (req, res) => {
  try {
    const ResetToken = await tokenModel.findOne({ UserId: req.body.userId });
    console.log(ResetToken);
    if (!ResetToken) {
      res.json({
        message: "Token was expired or not exists",
      });
    } else {
      let isValid = bcrypt.compare(ResetToken.token, req.body.token);
      if (isValid) {
        const hash = await bcrypt.hash(req.body.password, 10);
        console.log(hash);
        console.log(req.body.userId);
        await userModel.updateOne(
          { _id: req.body.userId },
          {
            $set: { password: hash },
          }
        );
        let newuser = await userModel.findOne({ _id: req.body.userId });
        console.log(newuser);
        sendEmail(
          newuser.email,
          "Password Reset Successfully",
          {
            name: newuser.username,
          },
          "./utils/template/resetPassword.handlebars"
        );
        res.json({
          message: "Reset password successfully",
        });
        ResetToken.deleteOne();
      } else {
        console.log("false");
      }
    }
  } catch (err) {
    console.log(err);
  }
};
export {
  studentLogin,
  studentSignUp,
  studentUpdate,
  studentView,
  studentPassChange,
  RequestPasswordReset,
  resetPassword,
  verifyAcount,
};
