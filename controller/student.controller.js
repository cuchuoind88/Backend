import bcrypt from "bcrypt";
import userModel from "../models/User.js";
import JWT from "jsonwebtoken";
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
    let newuser = new userModel({
      ...req.body,
      password: hashpass,
    });
    newuser.save();
    const token = JWT.sign(
      {
        userID: newuser._id,
        userName: newuser.username,
        userRole: newuser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15d",
      }
    );
    res.json({
      token: token,
      message: "Register Sucessfully",
    });
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
      if (isValidPass) {
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

export {
  studentLogin,
  studentSignUp,
  studentUpdate,
  studentView,
  studentPassChange,
};
